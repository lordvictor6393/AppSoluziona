import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';
import { User } from '../../user/user.model';
import { UsersService } from '../../user/user.service';
import { MatTableDataSource, MatTable, MatSort } from '../../../../node_modules/@angular/material';
import { Client } from '../../client/client.model';
import { ClientService } from '../../client/client.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-p-add-edit',
  templateUrl: './p-add-edit.component.html',
  styleUrls: ['./p-add-edit.component.css']
})
export class PAddEditComponent implements OnInit {

  isNew: boolean = false;
  selectedProjectId: string;
  initialProjectData: Project;

  users: User[] = [];
  clients: Client[] = [];
  projectForm: FormGroup;

  userToBeAdded: User;
  memberGridColumns: string[];
  projectMembers: User[] = [];
  userIdsToBeUnregistered: string[] = [];
  projMembersDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatTable) membersTable: MatTable<User>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('availableUsersCombo') availableUsersCombo: ElementRef;

  constructor(private userService: UsersService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.userService.getUserList().subscribe(
      userList => {
        this.users = userList;
        console.log('users', this.users);
      }
    );
    this.clientService.getClientList().subscribe(
      clientList => {
        this.clients = clientList;
        console.log('clients', this.clients);
      }
    );
    this.projectForm = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null),
      leadId: new FormControl(null),
      budget: new FormControl(null),
      clientId: new FormControl(null),
      contactDetails: new FormGroup({
        contactName: new FormControl(null),
        contactPhone: new FormControl(null)
      })
    });
    this.route.params.subscribe(
      params => {
        this.selectedProjectId = params.id;
        this.projMembersDataSource.sort = this.sort;
        if (this.selectedProjectId) {
          this.loadProjectData()
        } else {
          this.isNew = true;
          this.projectForm.patchValue({ code: this.projectService.generateProjectCode() });
          this.projMembersDataSource.data = [];
        }
      }
    );

    this.memberGridColumns = ['name', 'ci', 'phone', 'mail', 'removeBtn'];
  }

  loadProjectData() {
    this.projectService.getProject(this.selectedProjectId).subscribe(
      projData => {
        this.initialProjectData = projData;
        this.projectForm.setValue({
          code: projData.code,
          name: projData.name,
          leadId: projData.leadId,
          budget: projData.budget,
          clientId: projData.clientId,
          contactDetails: {
            contactName: projData.contactDetails.contactName,
            contactPhone: projData.contactDetails.contactPhone
          }
        });
        this.projectMembers = projData.membersIds.map(
          userId => {
            console.log(this.users);
            let userInstance = this.users.find(
              user => {
                let matchId = user.id == userId;
                return matchId;
              }
            )
            return userInstance;
          }
        );
        if(this.projectMembers.length) {
          this.projMembersDataSource.data = this.projectMembers;
          console.log('members data source', this.projMembersDataSource.data);
        }
        console.log('project members', this.projectMembers);
      }
    );
  }

  getAvailableUsers() {
    // console.log("get available users", this.users);
    return this.users.length ? this.users.filter(
      user => {
        return !this.userIsInProject(user)
      }
    ) : [];
  }

  userIsInProject(user) {
    // console.log("get available users", this.projectMembers);
    return this.projectMembers.length ? this.projectMembers.find(
      projUser => projUser.id == user.id
    ) : false;
  }

  onAddMember() {
    this.projectMembers.push(this.userToBeAdded);
    // this.membersTable.renderRows();
    this.projMembersDataSource.data = this.projectMembers;
    let idx = this.userIdsToBeUnregistered.indexOf(this.userToBeAdded.id);
    if(idx !== -1) {
      this.userIdsToBeUnregistered.splice(idx, 1);
    }
    this.userToBeAdded = null;
  }

  onRemoveMember(userId) {
    let index =  this.projectMembers.findIndex(user => user.id == userId);
    if(index != -1) {
      this.projectMembers.splice(index, 1);
      this.userIdsToBeUnregistered.push(userId);
    } else {
      console.error('Cannot find user.')
    }
    // this.membersTable.renderRows();
    this.projMembersDataSource.data = this.projectMembers;
  }

  onSaveProject() {
    let projData = this.projectForm.value;
    projData.membersIds = this.projectMembers.map(pMember => pMember.id);
    console.log('project to be saved: ', projData);
    if(this.isNew) {
      this.projectService.addProject(projData);
    } else {
      this.projectService.updateProject(this.selectedProjectId, projData);
      this.userIdsToBeUnregistered.forEach(
        userId => this.userService.unregisterProject(userId, this.selectedProjectId)
      );
      if(this.initialProjectData.clientId != projData.clientId) {
        this.clientService.unregisterProject(this.initialProjectData.clientId, this.selectedProjectId);
      }
    }
    this.clientService.registerProject(projData.clientId, this.selectedProjectId);
    this.backToProjectsList();
  }

  backToProjectsList() {
    this.router.navigate(['projects'])
  }
}
