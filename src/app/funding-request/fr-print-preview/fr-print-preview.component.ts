import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { FundingRequest } from '../funding-request.model';
import { Project } from '../../project/project.model';
import { Client } from '../../client/client.model';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-fr-print-preview',
  templateUrl: './fr-print-preview.component.html',
  styleUrls: ['./fr-print-preview.component.scss']
})
export class FrPrintPreviewComponent implements OnInit {

  owner: User;
  approver: User;
  proj: Project;
  client: Client;
  fr: FundingRequest;
  emptyRows: Array<any>;

  constructor(private dialog: MatDialogRef<FrPrintPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { fr: FundingRequest, projects: Project[], clients: Client[], users: User[] }) { }

  ngOnInit() {
    this.fr = this.data.fr;
    this.proj = this.data.projects.find(proj => proj.id === this.fr.projectId);
    this.owner = this.data.users.find(user => user.id === this.fr.createUserId);
    this.approver = this.data.users.find(user => user.id === this.fr.approveUserId);
    this.client = this.data.clients.find(client => client.id === this.fr.clientId);
    this.emptyRows = Array(15 - this.fr.items.length);
  }
}
