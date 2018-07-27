import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { FundingRequest } from '../funding-request.model';
import { Project } from '../../project/project.model';
import { ProjectService } from '../../project/project.service';
import { Client } from '../../client/client.model';
import { User } from '../../user/user.model';
import { ClientService } from '../../client/client.service';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-fr-print-preview',
  templateUrl: './fr-print-preview.component.html',
  styleUrls: ['./fr-print-preview.component.scss']
})
export class FrPrintPreviewComponent implements OnInit {

  user: User;
  proj: Project;
  client: Client;
  emptyRows: Array<any>;
  
  constructor(private dialog: MatDialogRef<FrPrintPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) private fr: FundingRequest,
    private pService: ProjectService,
    private cService: ClientService,
    private uService: UsersService) { }

  ngOnInit() {
    this.pService.getProject(this.fr.projectId).subscribe(
      projData => this.proj = projData
    );
    this.cService.getClient(this.fr.clientId).subscribe(
      clientData => this.client = clientData
    );
    this.uService.getUser(this.fr.createUserId).subscribe(
      userData => this.user = userData
    );
    this.emptyRows = Array(15 - this.fr.items.length);
  }
}
