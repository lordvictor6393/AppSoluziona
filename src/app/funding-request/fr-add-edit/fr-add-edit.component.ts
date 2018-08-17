import * as SZ from '../../globalConstants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FundingRequestItem } from './fr-form-item/funding-request-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../../user/user.model';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/client.model';
import { MatDialog, MatTable, MatTableDataSource, MatSort } from '@angular/material';
import { FrFormItemComponent } from './fr-form-item/fr-form-item.component';
import { Project } from '../../project/project.model';
import { FundingRequest } from '../funding-request.model';
import { ProjectService } from '../../project/project.service';
import { FundingRequestService } from '../funding-request.service';
import { AuthService } from '../../auth/auth.service';
import { RejectReasonComponent } from '../reject-reason/reject-reason.component';
import { FrPrintPreviewComponent } from '../fr-print-preview/fr-print-preview.component';
import { combineLatest } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-fr-add-edit',
  templateUrl: './fr-add-edit.component.html',
  styleUrls: ['./fr-add-edit.component.scss']
})
export class FrAddEditComponent implements OnInit {

  isNew = false;
  selectedFrId: string;
  initialFrData: FundingRequest;

  users: User[] = [];
  clients: Client[] = [];
  projects: Project[] = [];
  fundingRequestForm: FormGroup;

  selectedUser: User;
  userProjects: Project[] = [];
  clientIdOfSelectedProject = '';
  paymentTypes = ['Efectivo', 'Cheque', 'Transferencia'];

  frGridColumns: string[];
  frItems: FundingRequestItem[] = [];
  frItemsDataSource: MatTableDataSource<FundingRequestItem> = new MatTableDataSource<FundingRequestItem>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) frItemTable: MatTable<FundingRequestItem>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public fundingRequestService: FundingRequestService,
    private projectService: ProjectService,
    public clientService: ClientService,
    private userService: UsersService,
    public authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fundingRequestForm = new FormGroup({
      code: new FormControl(null),
      createUserId: new FormControl(null),
      projectId: new FormControl(null),
      date: new FormControl(null),
      detail: new FormControl(null),
      observations: new FormControl(null),
      accordance: new FormGroup({
        paymentType: new FormControl(null),
        voucher: new FormControl(null),
        receiverUserId: new FormControl(null),
        deliverUserId: new FormControl(null)
      })
    });

    this.frGridColumns = [
      'position',
      'detail',
      'quantity',
      'singlePrice',
      'totalPrice'
    ];

    combineLatest(this.userService.getUserList(),
      this.clientService.getClientList(),
      this.projectService.getProjectList()).subscribe(
        res => {
          this.users = res[0] || [];
          this.clients = res[1] || [];
          this.projects = res[2] || [];
          if (!this.users.length) {
            this.users.push(this.authService.loggedUserInstance);
          }
          this.route.params.subscribe(
            params => {
              this.selectedFrId = params.id;
              if (this.selectedFrId) {
                this.loadFundingRequestData();
              } else {
                this.isNew = true;
                this.fundingRequestForm.patchValue({
                  code: this.fundingRequestService.generateFrCode(),
                  createUserId: this.authService.loggedUserId
                });
                this.updateCurrentSelectedUser();
                this.frItemsDataSource.data = [];
                this.frGridColumns.push('editBtn');
              }
            }
          );
        }
      );

    // this.frItemsDataSource.sort = this.sort;
  }

  updateCurrentSelectedUser() {
    this.selectedUser = this.users.find(
      userElement => userElement.id === this.fundingRequestForm.get('createUserId').value
    );
    const userProjs = this.selectedUser.projectIds || [];
    this.userProjects = this.projects.filter(proj => userProjs.includes(proj.id));
  }

  updateClientName() {
    const projId = this.fundingRequestForm.get('projectId').value;
    const project = this.projects.find(proj => proj.id === projId);
    if (project) {
      this.clientIdOfSelectedProject = project.clientId;
    }
  }

  loadFundingRequestData() {
    this.fundingRequestService.getFr(this.selectedFrId).subscribe(
      frData => {
        this.initialFrData = frData;
        const patch = {};
        if (frData.code) { patch['code'] = frData.code; }
        if (frData.createUserId) { patch['createUserId'] = frData.createUserId; }
        if (frData.projectId) { patch['projectId'] = frData.projectId; }
        if (frData.date) { patch['date'] = frData.date; }
        if (frData.detail) { patch['detail'] = frData.detail; }
        if (frData.observations) { patch['observations'] = frData.observations; }
        if (frData.accordance) {
          patch['accordance'] = {};
          if (frData.accordance.paymentType) { patch['accordance']['paymentType'] = frData.accordance.paymentType; }
          if (frData.accordance.voucher) { patch['accordance']['voucher'] = frData.accordance.voucher; }
          if (frData.accordance.receiverUserId) { patch['accordance']['receiverUserId'] = frData.accordance.receiverUserId; }
          if (frData.accordance.deliverUserId) { patch['accordance']['deliverUserId'] = frData.accordance.deliverUserId; }
        }
        this.fundingRequestForm.patchValue(patch);
        this.updateClientName();
        this.updateCurrentSelectedUser();
        if (!this.initialFrData.isSent) {
          this.frGridColumns.push('editBtn');
        }
        this.frItems = frData.items.map(
          frItemData => new FundingRequestItem(
            frItemData.detail,
            frItemData.quantity,
            frItemData.singlePrice,
            frItemData.totalPrice
          )
        );
        if (this.frItems.length) {
          this.frItemsDataSource.data = this.frItems;
        }
      }
    );
  }

  getFrTotal() {
    let total = 0;
    this.frItems.map(
      frItem => total += (frItem.totalPrice * 10)
    );
    return total / 10;
  }

  canBeModified() {
    let allowed = this.isNew;
    if (this.initialFrData) {
      allowed = allowed || !this.initialFrData.isSent;
      allowed = allowed || (this.authService.CanManageAllFrEr() && this.initialFrData.state === SZ.VERIFIED);
    }
    return allowed;
  }

  addFundingRequestItem(recordData?: FundingRequestItem) {
    const isEditing = recordData ? true : false;
    const itemForm = this.dialog.open(FrFormItemComponent, {
      data: recordData || {}
    });
    itemForm.afterClosed().subscribe(
      frItem => {
        if (frItem) {
          if (isEditing) {
            recordData.updateData(frItem);
          } else {
            this.frItems.push(frItem);
          }
          // this.frItemTable.renderRows();
          this.frItemsDataSource.data = this.frItems;
        }
      }
    );
  }

  deleteFundingRequestItem(index: number) {
    if (index > -1) {
      this.frItems.splice(index, 1);
      // this.frItemTable.renderRows();
      this.frItemsDataSource.data = this.frItems;
    }
  }

  onSendFr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialFrData.activity || [];
    if (user && !this.initialFrData.isSent) {
      activity.push({
        action: SZ.SENT,
        userId: this.authService.getLoggedUserId(),
        date: new Date().getTime()
      });
      this.fundingRequestService.sendFr(this.initialFrData.id, activity);
    }
    this.backToFrList();
  }

  onApproveFr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialFrData.activity || [];
    if (user && this.initialFrData.isSent) {
      if (user.leadOf.indexOf(this.initialFrData.projectId) !== -1) {
        activity.push({
          action: SZ.VERIFIED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.fundingRequestService.verifyFr(this.initialFrData.id, activity);
      } else if (this.authService.CanManageAllFrEr()) {
        activity.push({
          action: SZ.APPROVED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.fundingRequestService.approveFr(this.initialFrData.id, activity);
      }
    }
  }

  onRejectFr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialFrData.activity || [];
    if (user && this.initialFrData.isSent) {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe(
        reason => {
          if (reason) {
            activity.push({
              action: SZ.REJECTED,
              userId: this.authService.getLoggedUserId(),
              date: new Date().getTime(),
              reason: reason
            });
            this.fundingRequestService.rejectFr(this.initialFrData.id, activity);
          }
        }
      );
    }
  }

  onSaveFr() {
    const frData = this.fundingRequestForm.value;
    frData.items = this.frItems.map(
      frItem => frItem.getRawObject()
    );
    frData.total = this.getFrTotal();
    frData.clientId = this.clientIdOfSelectedProject;
    console.log('request to be saved: ', frData);
    if (this.isNew) {
      this.fundingRequestService.addFr(frData);
    } else {
      this.fundingRequestService.updateFr(this.selectedFrId, frData);
    }
    this.backToFrList();
  }

  onCreateEr() {
    this.router.navigate(['expenseReports', 'create', this.selectedFrId]);
  }

  onDeleteFr() {
    this.fundingRequestService.deleteFr(this.selectedFrId);
  }

  backToFrList() {
    this.router.navigate(['fundingRequests']);
  }

  showFrPreview() {
    const frData = this.fundingRequestForm.value;
    frData.items = this.frItems.map(
      frItem => frItem.getRawObject()
    );
    frData.total = this.getFrTotal();
    frData.clientId = this.clientIdOfSelectedProject;
    this.dialog.open(FrPrintPreviewComponent, {
      data: {
        fr: frData,
        projects: this.projects,
        clients: this.clients,
        users: this.users
      }
    });
  }
}
