import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTable } from '../../../../node_modules/@angular/material';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { UsersService } from '../../user/user.service';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-p-list',
  templateUrl: './p-list.component.html',
  styleUrls: ['./p-list.component.css']
})
export class PListComponent implements OnInit {

  projects: Project[];
  pListColumns: string[];
  projectsDataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) projectsTable: MatTable<Project>;

  constructor(private projectService: ProjectService,
    private userService: UsersService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.pListColumns = [
      'code',
      'name',
      'lead',
      'client',
      // 'totalExpense',
      'editBtn'
    ];
    this.projectService.getProjectList().subscribe(
      projectsList => {
        this.projects = projectsList;
        this.projectsDataSource.data = this.projects;
      }
    );
    this.projectsDataSource.sort = this.sort;
  }

  onEditProject(projectId: string) {
    this.router.navigate([projectId], {
      relativeTo: this.route
    })
  }

  onAddProject() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  onDeleteProject(projId: string) {
    this.projectService.deleteProject(projId);
  }
}
