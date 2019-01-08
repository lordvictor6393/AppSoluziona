import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';
import { User } from '../../user/user.model';
import { UsersService } from '../../user/user.service';
import { MatTableDataSource, MatTable, MatSort, MatSnackBar } from '../../../../node_modules/@angular/material';
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

  isNew = false;
  selectedProjectId: string;
  initialProjectData: Project;

  users: User[] = [];
  clients: Client[] = [];
  projectForm: FormGroup;
  ciPlaceAbbr;

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
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.ciPlaceAbbr = {
      'La Paz': 'LP',
      'Oruro': 'OR',
      'Potosi': 'PT',
      'Cochabamba': 'CB',
      'Chuquisaca': 'CH',
      'Tarija': 'TJ',
      'Santa Cruz': 'SC',
      'Beni': 'BN',
      'Pando': 'PA'
    };
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
          this.loadProjectData();
        } else {
          this.isNew = true;
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
        const patch = {};
        if (projData.code) { patch['code'] = projData.code; }
        if (projData.name) { patch['name'] = projData.name; }
        if (projData.leadId) { patch['leadId'] = projData.leadId; }
        if (projData.budget) { patch['budget'] = projData.budget; }
        if (projData.clientId) { patch['clientId'] = projData.clientId; }
        if (projData.contactDetails) {
          patch['contactDetails'] = {};
          if (projData.contactDetails.contactName) { patch['contactDetails']['contactName'] = projData.contactDetails.contactName; }
          if (projData.contactDetails.contactPhone) { patch['contactDetails']['contactPhone'] = projData.contactDetails.contactPhone; }
        }
        this.projectForm.patchValue(patch);
        this.projectMembers = projData.membersIds.map(
          userId => {
            console.log(this.users);
            const userInstance = this.users.find(
              user => {
                const matchId = user.id === userId;
                return matchId;
              }
            );
            return userInstance;
          }
        );
        if (this.projectMembers.length) {
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
        return !this.userIsInProject(user);
      }
    ) : [];
  }

  userIsInProject(user) {
    // console.log("get available users", this.projectMembers);
    return this.projectMembers.length ? this.projectMembers.find(
      projUser => projUser.id === user.id
    ) : false;
  }

  addLeadMember() {
    const me = this;
    const leadId = me.projectForm.get('leadId').value;
    if (leadId) {
      me.userToBeAdded = this.users.find(user => user.id === leadId);
      me.onAddMember();
    }
  }

  onAddMember() {
    const me = this;
    if (me.userToBeAdded.id) {
      if (me.projectMembers.findIndex(member => member.id === me.userToBeAdded.id) === -1) {
        me.projectMembers.push(me.userToBeAdded);
        // me.membersTable.renderRows();
        me.projMembersDataSource.data = me.projectMembers;
        const idx = me.userIdsToBeUnregistered.indexOf(me.userToBeAdded.id);
        if (idx !== -1) {
          me.userIdsToBeUnregistered.splice(idx, 1);
        }
      }
      me.userToBeAdded = null;
    }
  }

  onRemoveMember(userId) {
    const me = this;
    if (me.projectForm.get('leadId').value !== userId) {
      const index = me.projectMembers.findIndex(user => user.id === userId);
      if (index !== -1) {
        me.projectMembers.splice(index, 1);
        me.userIdsToBeUnregistered.push(userId);
      } else {
        console.warn('Cannot find user.');
      }
      // me.membersTable.renderRows();
      me.projMembersDataSource.data = me.projectMembers;
    } else {
      me.snackBar.open('No se puede eliminar al encargado del proyecto.', 'ok', { duration: 4000 });
    }
  }

  onSaveProject() {
    const projData = this.projectForm.value;
    if (!projData.code) { delete projData.code; }
    if (!projData.name) { delete projData.name; }
    if (!projData.leadId) { delete projData.leadId; }
    if (!projData.budget) { delete projData.budget; }
    if (!projData.clientId) { delete projData.clientId; }
    if (!projData.contactDetails) {
      delete projData.contactDetails;
    } else {
      if (!projData.contactDetails.contactName) { delete projData.contactDetails.contactName; }
      if (!projData.contactDetails.contactPhone) { delete projData.contactDetails.contactPhone; }
    }
    if (this.projectMembers.length) { projData.membersIds = this.projectMembers.map(pMember => pMember.id); }
    console.log('project to be saved: ', projData);
    if (this.isNew) {
      this.projectService.addProject(projData).then(
        projectRawData => {
          this.clientService.registerProject(projData.clientId, projectRawData.id);
          this.userService.registerProject(projData.leadId, projectRawData.id, true);
          projData.membersIds.forEach(memberId => {
            this.userService.registerProject(memberId, projectRawData.id);
          });
        }
      );
    } else {
      if (this.initialProjectData.leadId !== projData.leadId) {
        this.userService.unregisterProject(this.initialProjectData.leadId, this.selectedProjectId, true);
      }
      this.projectService.updateProject(this.selectedProjectId, projData);
      projData.membersIds.forEach(memberId => {
        this.userService.registerProject(memberId, this.initialProjectData.id);
      });
      this.userIdsToBeUnregistered.forEach(
        userId => this.userService.unregisterProject(userId, this.selectedProjectId)
      );
      if (this.initialProjectData.clientId !== projData.clientId) {
        this.clientService.unregisterProject(this.initialProjectData.clientId, this.selectedProjectId);
      }
      this.clientService.registerProject(projData.clientId, this.selectedProjectId);
    }
    this.backToProjectsList();
  }

  onDeleteProject() {
    this.projectService.deleteProject(this.initialProjectData);
  }

  backToProjectsList() {
    this.router.navigate(['projects']);
  }
}
