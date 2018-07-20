import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';
import { Project } from '../../project/project.model';
import { ProjectService } from '../../project/project.service';
import { MatTableDataSource, MatSort, MatTable } from '../../../../node_modules/@angular/material';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-u-add-edit',
  templateUrl: './u-add-edit.component.html',
  styleUrls: ['./u-add-edit.component.css']
})
export class UAddEditComponent implements OnInit {

  isNew: boolean = false;
  selectedUserId: string;
  initialUserData: User;

  projects: Project[] = [];
  pGridColumns: string[];
  pGridDataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) projectsTable: MatTable<Project>;

  userForm: FormGroup;
  dptosBolivia: string[];

  @ViewChild('userPassword') userPassword: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private clientService: ClientService,
    private userService: UsersService) { }

  ngOnInit() {
    this.pGridColumns = ['code', 'name', 'lead', 'client'];
    this.dptosBolivia = ['La Paz', 'Oruro', 'Potosi', 'Cochabamba', 'Chuquisaca', 'Tarija', 'Santa Cruz', 'Beni', 'Pando'];

    this.userForm = new FormGroup({
      'name': new FormControl(null),
      'lastName': new FormControl(null),
      'ci': new FormControl(null),
      'ciPlace': new FormControl(null),
      'displayName': new FormControl(null),
      'mail': new FormControl(null),
      'phone': new FormControl(null),
      'position': new FormControl(null)
    });

    this.route.params.subscribe(
      params => {
        this.selectedUserId = params.id;
        if (this.selectedUserId) {
          this.loadUser();
        } else {
          this.isNew = true;
        }
      }
    );
    this.pGridDataSource.sort = this.sort;
  }

  getUserProjects() {
    return this.projects.filter(
      project => this.initialUserData.projectIds.indexOf(project.id) !== -1
    )
  }

  loadUser() {
    this.userService.getUser(this.selectedUserId).subscribe(
      user => {
        this.initialUserData = user;
        this.userForm.setValue({
          name: user.name,
          lastName: user.lastName,
          ci: user.ci,
          ciPlace: user.ciPlace,
          mail: user.mail,
          phone: user.phone,
          displayName: user.displayName,
          position: user.position
        });
      }
    );
    this.projectService.getProjectList().subscribe(
      projList => {
        this.projects = projList;
        if(this.projects.length && this.initialUserData) this.pGridDataSource.data = this.getUserProjects();
      }
    );
  }

  onSaveUser() {
    let userData = this.userForm.value;
    if (this.isNew) {
      let password = this.userPassword.nativeElement.value;
      this.userService.addUser(userData, password);
    } else {
      this.userService.updateUser(this.selectedUserId, userData);
    }
    this.backToUsersList();
  }

  backToUsersList() {
    this.router.navigate(['/users']);
  }
}
