import * as SZ from '../../globalConstants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseReportService } from '../expense-report.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ExpenseReport } from '../expense-report.model';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '../../../../node_modules/@angular/material';
import { UsersService } from '../../user/user.service';
import { User } from '../../user/user.model';
import { Project } from '../../project/project.model';
import { ProjectService } from '../../project/project.service';
import { AuthService } from '../../auth/auth.service';
import { RejectReasonComponent } from '../../funding-request/reject-reason/reject-reason.component';
import { FrSelectorComponent } from './fr-selector/fr-selector.component';

@Component({
  selector: 'app-er-list',
  templateUrl: './er-list.component.html',
  styleUrls: ['./er-list.component.css']
})
export class ErListComponent implements OnInit {

  erListColumns: string[];
  reports: ExpenseReport[];
  erDataSource: MatTableDataSource<ExpenseReport> = new MatTableDataSource<ExpenseReport>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Filters
  filterByUserId: string;
  filterByState: string;
  filterByProjectId: string;
  filterBySearchText: string;

  users: User[];
  projects: Project[];
  states: string[] = [SZ.CREATED, SZ.SENT, SZ.VERIFIED, SZ.REJECTED, SZ.APPROVED];

  constructor(private expenseReportService: ExpenseReportService,
    private userService: UsersService,
    private projectService: ProjectService,
    public authService: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.erListColumns = [
      'code',
      'projectName',
      'createUser',
      'totalSpent',
      'totalReceived',
      'balance',
      'state',
      'editBtn'
    ];
    this.userService.getUserList().subscribe(
      userList => this.users = userList
    );
    this.projectService.getProjectList().subscribe(
      projectList => this.projects = projectList
    );
    this.expenseReportService.getErList().subscribe(
      erList => {
        this.reports = erList;
        if (this.reports.length) {
          this.erDataSource.data = this.reports;
        }
      }
    );
    this.erDataSource.sort = this.sort;
    this.erDataSource.paginator = this.paginator;
    this.erDataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (sortHeaderId === 'code') {
        return +data.code.split('-')[1];
      } else if (sortHeaderId === 'createUser') {
        return this.userService.getCompleteUserName(data.createUserId);
      } else if (sortHeaderId === 'projectName') {
        return this.projectService.getProjectName(data.projectId);
      } else if (sortHeaderId === 'totalReceived') {
        return data.totalReceived;
      } else if (sortHeaderId === 'totalSpent') {
        return data.totalSpent;
      } else if (sortHeaderId === 'balance') {
        return data.balance;
      } else {
        return (data[sortHeaderId] || '').toLowerCase();
      }
    };
    this.erDataSource.filterPredicate = (data: ExpenseReport) => {
      let match = true;
      if (this.filterByUserId) {
        match = match && (data.createUserId === this.filterByUserId);
      }
      if (this.filterByProjectId) {
        match = match && (data.projectId === this.filterByProjectId);
      }
      if (this.filterByState) {
        match = match && (data.state === this.filterByState);
      }
      if (this.filterBySearchText) {
        match = match && (new RegExp(this.filterBySearchText.trim(), 'i').test('' + data.totalSpent));
      }
      if (this.filterBySearchText) {
        match = match && (new RegExp(this.filterBySearchText.trim(), 'i').test('' + data.totalReceived));
      }
      if (this.filterBySearchText) {
        match = match && (new RegExp(this.filterBySearchText.trim(), 'i').test('' + data.balance));
      }
      return match;
    };
  }

  filterErListData(value?: string) {
    this.erDataSource.filter = value;
  }

  searchText(value: string) {
    this.filterBySearchText = value;
    this.erDataSource.filter = value;
  }

  onEditExpenseReport(erId: string) {
    this.router.navigate([erId], {
      relativeTo: this.route
    });
  }

  onSendExpenseReport(er: ExpenseReport) {
    const user = this.authService.loggedUserInstance;
    const activity = er.activity || [];
    if (user && !er.isSent) {
      activity.push({
        action: SZ.SENT,
        userId: this.authService.getLoggedUserId(),
        date: new Date().getTime()
      });
      this.expenseReportService.sendEr(er.id, activity);
    }
  }

  onVerifyExpenseReport(er: ExpenseReport) {
    const user = this.authService.loggedUserInstance;
    const activity = er.activity || [];
    if (user && er.isSent) {
      if (this.authService.CanVerifyEr(er)) {
        activity.push({
          action: SZ.VERIFIED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.expenseReportService.verifyEr(er.id, activity);
      }
    }
  }

  onApproveExpenseReport(er: ExpenseReport) {
    const user = this.authService.loggedUserInstance;
    const activity = er.activity || [];
    if (user && er.isSent) {
      if (this.authService.CanApproveEr(er)) {
        activity.push({
          action: SZ.APPROVED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.expenseReportService.approveEr(er.id, activity);
      }
    }
  }

  onRejectExpenseReport(er: ExpenseReport) {
    const user = this.authService.loggedUserInstance;
    const activity = er.activity || [];
    if (user && er.isSent) {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe(
        reason => {
          if (reason) {
            activity.push({
              action: SZ.REJECTED,
              userId: this.authService.getLoggedUserId(),
              date: new Date().getTime(),
              reason: reason
            });
            this.expenseReportService.rejectEr(er.id, activity);
          }
        }
      );
    }
  }

  onSelectFundingRequest() {
    this.dialog.open(FrSelectorComponent).afterClosed().subscribe(
      selectedFrId => {
        if (selectedFrId) {
          this.onAddExpenseReport(selectedFrId);
        }
      }
    );
  }

  onAddExpenseReport(frId: string) {
    this.router.navigate(['create', frId], {
      relativeTo: this.route
    });
  }

  onDeleteExpenseReport(erId: string) {
    this.expenseReportService.deleteEr(erId);
  }
}
