import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { Project } from '../../project/project.model';
import { Client } from '../../client/client.model';
import { FundingRequest } from '../../funding-request/funding-request.model';
import { ExpenseReport } from '../expense-report.model';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-er-print-preview',
  templateUrl: './er-print-preview.component.html',
  styleUrls: ['./er-print-preview.component.scss']
})
export class ErPrintPreviewComponent implements OnInit {

  owner: User;
  approver: User;
  proj: Project;
  client: Client;
  fr: FundingRequest;
  er: ExpenseReport;
  emptyRows: Array<any>;

  constructor(private dialog: MatDialogRef<ErPrintPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      er: ExpenseReport,
      fr: FundingRequest,
      projects: Project[],
      clients: Client[],
      users: User[]
    }) { }

  ngOnInit() {
    this.er = this.data.er;
    this.fr = this.data.fr;
    this.proj = this.data.projects.find(proj => proj.id === this.er.projectId);
    this.owner = this.data.users.find(user => user.id === this.er.createUserId);
    this.approver = this.data.users.find(user => user.id === this.er.approveUserId);
    this.client = this.data.clients.find(client => client.id === this.fr.clientId);
    this.emptyRows = Array(15 - this.er.items.length);
  }

}
