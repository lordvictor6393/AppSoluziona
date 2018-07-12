import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-p-list',
  templateUrl: './p-list.component.html',
  styleUrls: ['./p-list.component.css']
})
export class PListComponent implements OnInit {

  projects: Project[];
  pListColumns: string[];
  projectsDataSource: MatTableDataSource<Project>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.pListColumns = [
      'code',
      'name',
      'lead',
      'client',
      'totalExpense'
    ];
    this.projectService.getProjectList().subscribe(
      projectsList => {
        this.projects = projectsList;
        this.projectsDataSource = new MatTableDataSource(this.projects);
        this.projectsDataSource.sort = this.sort;
      }
    );
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
}
