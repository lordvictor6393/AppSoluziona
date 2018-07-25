import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { Project } from '../../project/project.model';
import { MatTableDataSource, MatSort, MatTable } from '../../../../node_modules/@angular/material';
import { ProjectService } from '../../project/project.service';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-c-add-edit',
  templateUrl: './c-add-edit.component.html',
  styleUrls: ['./c-add-edit.component.css']
})
export class CAddEditComponent implements OnInit {

  isNew: boolean = false;
  selectedClientId: string;
  initialClientData: Client;

  projects: Project[] = [];
  clientForm: FormGroup;

  pGridColumns: string[];
  clientProjects: Project[];
  projDataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) projectsTable: MatTable<Project>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private userService: UsersService,
              private clientService: ClientService) { }

  ngOnInit() {
    this.projectService.getProjectList().subscribe(
      projList => this.projects = projList
    );
    this.clientForm = new FormGroup({
      'name': new FormControl(null),
      'contactDetails': new FormGroup({
        'name': new FormControl(null),
        'phone': new FormControl(null)
      })
    });
    this.route.params.subscribe(
      params => {
        this.selectedClientId = params.id;
        if(this.selectedClientId) {
          this.loadClient();
        } else {
          this.isNew = true;
        }
      }
    )
    this.projDataSource.sort = this.sort;
    this.pGridColumns = ['code', 'name', 'lead'];
  }

  loadClient() {
    this.clientService.getClient(this.selectedClientId).subscribe(
      (client) => {
        this.initialClientData = client;
        this.clientForm.setValue({
          name: client.name,
          contactDetails:{
            name: client.contactDetails.name,
            phone: client.contactDetails.phone
          }
        });
        this.clientProjects = client.projectsIds.map(
          projId => {
            let projInstance = this.projects.find(
              project => project.id == projId
            );
            return projInstance;
          }
        );
        if(this.clientProjects.length) {
          this.projDataSource.data = this.clientProjects;
        }
      }
    )
  }

  onSaveClient() {
    let formValues = this.clientForm.value;
    let clientData = {
      name: formValues.name,
      contactDetails: {
        name: formValues.contactDetails.name,
        phone: formValues.contactDetails.phone
      },
    };
    if(this.isNew) {
      this.clientService.addClient(clientData);
    } else {
      this.clientService.updateClient(this.selectedClientId, clientData);
    }
    this.backToClientsList();
  }

  onDeleteClient() {
    this.clientService.deleteClient(this.selectedClientId);
  }

  backToClientsList() {
    this.router.navigate(['/clients']);
  }
}
