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

  isNew = false;
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
        if (this.selectedClientId) {
          this.loadClient();
        } else {
          this.isNew = true;
        }
      }
    );
    this.projDataSource.sort = this.sort;
    this.pGridColumns = ['code', 'name', 'lead'];
  }

  loadClient() {
    this.clientService.getClient(this.selectedClientId).subscribe(
      (client) => {
        this.initialClientData = client;
        const patch = {};
        if (client.name) { patch['name'] = client.name; }
        if (client.contactDetails) {
          patch['contactDetails'] = {};
          if (client.contactDetails.name) { patch['contactDetails']['name'] = client.contactDetails.name; }
          if (client.contactDetails.phone) { patch['contactDetails']['phone'] = client.contactDetails.phone; }
        }
        this.clientForm.patchValue(patch);
        this.clientProjects = client.projectsIds.map(
          projId => {
            const projInstance = this.projects.find(
              project => project.id === projId
            );
            return projInstance;
          }
        );
        if (this.clientProjects.length) {
          this.projDataSource.data = this.clientProjects;
        }
      }
    );
  }

  onSaveClient() {
    const clientData = this.clientForm.value;
    if (!clientData.name) { delete clientData.name; }
    if (!clientData.contactDetails) {
      delete clientData.contactDetails;
    } else {
      if (!clientData.contactDetails.name) { delete clientData.contactDetails.name; }
      if (!clientData.contactDetails.phone) { delete clientData.contactDetails.phone; }
    }
    if (this.isNew) {
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
