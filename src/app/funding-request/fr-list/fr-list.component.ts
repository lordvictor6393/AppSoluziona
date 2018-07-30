import * as SZ from '../../globalConstants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FundingRequest } from '../funding-request.model';
import { FundingRequestService } from '../funding-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { UsersService } from '../../user/user.service';
import { ProjectService } from '../../project/project.service';
import { Project } from '../../project/project.model';
import { User } from '../../user/user.model';
import { AuthService } from '../../auth/auth.service';
import { RejectReasonComponent } from '../reject-reason/reject-reason.component';
import { Client } from '../../client/client.model';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-fr-list',
  templateUrl: './fr-list.component.html',
  styleUrls: ['./fr-list.component.css']
})
export class FrListComponent implements OnInit {

  frListColumns: string[];
  requests: FundingRequest[];
  frDataSource: MatTableDataSource<FundingRequest> = new MatTableDataSource<FundingRequest>();
  @ViewChild(MatSort) sort: MatSort;

  // Filters
  filterByUserId: string;
  filterByState: string;
  filterByProjectId: string;
  filterBySearchText: string;

  users: User[];
  clients: Client[];
  projects: Project[];
  states: string[] = [SZ.CREATED, SZ.SENT, SZ.VERIFIED, SZ.REJECTED, SZ.APPROVED];

  constructor(private fundingRequestService: FundingRequestService,
    private userService: UsersService,
    private clientService: ClientService,
    private projectService: ProjectService,
    public authService: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.frListColumns = [
      'code',
      'detail',
      'createUser',
      'projectName',
      'state',
      'editBtn'
    ];
    this.userService.getUserList().subscribe(
      userList => this.users = userList
    );
    this.clientService.getClientList().subscribe(
      clientList => this.clients = clientList
    );
    this.projectService.getProjectList().subscribe(
      projectList => this.projects = projectList
    );
    this.fundingRequestService.getFrList().subscribe(
      frList => {
        this.requests = frList;
        if (this.requests.length) {
          this.frDataSource.data = this.requests;
        }
      }
    );
    this.frDataSource.sort = this.sort;
    this.frDataSource.filterPredicate = (data: FundingRequest) => {
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
        match = match && (new RegExp(this.filterBySearchText.trim(), 'i').test(data.detail));
      }
      return match;
    };
    // Transform the data into a lowercase string of all property values.
    // var /** @type {?} */ accumulator = function (currentTerm, key) { return currentTerm + data[key]; };
    // var /** @type {?} */ dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
    // Transform the filter by converting it to lowercase and removing whitespace.
    // var /** @type {?} */ transformedFilter = filter.trim().toLowerCase();
    // return dataStr.indexOf(transformedFilter) != -1;
  }

  filterFrListData(value?: string) {
    this.frDataSource.filter = value;
  }

  searchText(value: string) {
    this.filterBySearchText = value;
    this.frDataSource.filter = value;
  }

  onEditFundingRequest(frId: string) {
    this.router.navigate([frId], {
      relativeTo: this.route
    });
  }

  onSendFundingRequest(fr: FundingRequest) {
    const user = this.authService.loggedUserInstance;
    const activity = fr.activity || [];
    if (user && !fr.isSent) {
      activity.push({
        action: SZ.SENT,
        userId: this.authService.getLoggedUserId(),
        date: new Date().getTime()
      });
      this.fundingRequestService.sendFr(fr.id, activity);
    }
  }

  onApproveFundingRequest(fr: FundingRequest) {
    const user = this.authService.loggedUserInstance;
    const activity = fr.activity || [];
    if (user && fr.isSent) {
      if (user.leadOf.indexOf(fr.projectId) !== -1) {
        activity.push({
          action: SZ.VERIFIED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.fundingRequestService.verifyFr(fr.id, activity);
      } else if (this.authService.CanManageAllFrEr()) {
        activity.push({
          action: SZ.APPROVED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.fundingRequestService.approveFr(fr.id, activity);
      }
    }
  }

  onRejectFundingRequest(fr: FundingRequest) {
    const user = this.authService.loggedUserInstance;
    const activity = fr.activity || [];
    if (user && fr.isSent) {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe(
        reason => {
          if (reason) {
            activity.push({
              action: SZ.REJECTED,
              userId: this.authService.getLoggedUserId(),
              date: new Date().getTime(),
              reason: reason
            });
            this.fundingRequestService.rejectFr(fr.id, activity);
          }
        }
      );
    }
  }

  onCreateExpenseReport(frId: string) {
    this.router.navigate(['expenseReports', 'create', frId]);
  }

  onAddFundingRequest() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  onDeleteFundingRequest(frId: string) {
    this.fundingRequestService.deleteFr(frId);
  }
}
