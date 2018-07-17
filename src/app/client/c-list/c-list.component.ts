import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatTable } from '../../../../node_modules/@angular/material';
import { ProjectService } from '../../project/project.service';
import { Project } from '../../project/project.model';

@Component({
  selector: 'app-c-list',
  templateUrl: './c-list.component.html',
  styleUrls: ['./c-list.component.css']
})
export class CListComponent implements OnInit {

  clients: Client[];
  projects: Project[];
  cListColumns: string[];
  clientsDataSource: MatTableDataSource<Client> = new MatTableDataSource<Client>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) clientsTable: MatTable<Client>;

  constructor(private clientService: ClientService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.cListColumns = ['name', 'contact', 'projects', 'editBtn'];
    this.projectService.getProjectList().subscribe(projList => this.projects = projList);
    this.clientService.getClientList().subscribe(
      clientsList => {
        this.clients = clientsList;
        this.clientsDataSource.data = this.clients;
      }
    );
    this.clientsDataSource.sort = this.sort;
  }

  onEditClient(clientId: string) {
    this.router.navigate([clientId], {
      relativeTo: this.route
    });
  }

  onAddClient() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }
  
  onDeleteClient(clientId: string) {
    this.clientService.deleteClient(clientId);
  }
}
