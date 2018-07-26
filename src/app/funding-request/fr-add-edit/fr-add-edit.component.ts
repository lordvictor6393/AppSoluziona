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

@Component({
  selector: 'app-fr-add-edit',
  templateUrl: './fr-add-edit.component.html',
  styleUrls: ['./fr-add-edit.component.css']
})
export class FrAddEditComponent implements OnInit {

  isNew: boolean = false;
  selectedFrId: string;
  initialFrData: FundingRequest;

  users: User[] = [];
  clients: Client[] = [];
  projects: Project[] = [];
  fundingRequestForm: FormGroup;

  selectedUser: User;
  selectedUserId: string;
  clientIdOfSelectedProject: string = '';
  paymentTypes = ['Efectivo', 'Cheque', 'Transferencia'];

  frGridColumns: string[];
  frItems: FundingRequestItem[] = [];
  frItemsDataSource: MatTableDataSource<FundingRequestItem> = new MatTableDataSource<FundingRequestItem>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) frItemTable: MatTable<FundingRequestItem>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fundingRequestService: FundingRequestService,
    private projectService: ProjectService,
    private clientService: ClientService,
    private userService: UsersService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.userService.getUserList().subscribe(
      usersList => this.users = usersList
    );
    this.clientService.getClientList().subscribe(
      clientList => this.clients = clientList
    );
    this.projectService.getProjectList().subscribe(
      projList => this.projects = projList
    );
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

    this.route.params.subscribe(
      params => {
        this.selectedFrId = params.id;
        if (this.selectedFrId) {
          this.loadFundingRequestData()
        } else {
          this.isNew = true;
          this.fundingRequestForm.patchValue({ code: this.fundingRequestService.generateFrCode() });
          this.frItemsDataSource.data = [];
        }
      }
    );

    this.frItemsDataSource.sort = this.sort;
    this.frGridColumns = [
      'position',
      'detail',
      'quantity',
      'singlePrice',
      'totalPrice',
      'editBtn'
    ];
  }

  updateCurrentSelectedUser() {
    this.selectedUser = this.users.find(
      userElement => userElement.id === this.selectedUserId
    )
  }

  updateClientName() {
    let projId = this.fundingRequestForm.get('projectId').value;
    let project = this.projects.find(proj => proj.id == projId);
    if (project) {
      this.clientIdOfSelectedProject = project.clientId;
    }
  }

  loadFundingRequestData() {
    this.fundingRequestService.getFr(this.selectedFrId).subscribe(
      frData => {
        this.initialFrData = frData;
        this.selectedUserId = frData.createUserId;
        this.updateCurrentSelectedUser();
        this.fundingRequestForm.setValue({
          code: frData.code,
          createUserId: frData.createUserId,
          projectId: frData.projectId,
          date: frData.date,
          detail: frData.detail,
          observations: frData.observations,
          accordance: {
            paymentType: frData.accordance.paymentType,
            voucher: frData.accordance.voucher,
            receiverUserId: frData.accordance.receiverUserId,
            deliverUserId: frData.accordance.deliverUserId,
          }
        });
        this.updateClientName();
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
        /**
         * 
         * 
         * 
         * remove
         * 
         * 
         */
        this.showFrPreview();
      }
    );
  }

  getFrTotal() {
    let total = 0;
    this.frItems.map(
      frItem => total += frItem.totalPrice
    )
    return total;
  }

  addFundingRequestItem(recordData?: FundingRequestItem) {
    let isEditing = recordData ? true : false;
    let itemForm = this.dialog.open(FrFormItemComponent, {
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
    )
  }

  deleteFundingRequestItem(index: number) {
    if (index > -1) {
      this.frItems.splice(index, 1);
      // this.frItemTable.renderRows();
      this.frItemsDataSource.data = this.frItems;
    }
  }

  onSendFr() {
    let user = this.authService.loggedUserInstance;
    let activity = this.initialFrData.activity || [];
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
    let user = this.authService.loggedUserInstance;
    let activity = this.initialFrData.activity || [];
    if (user && this.initialFrData.isSent) {
      if (user.leadOf.indexOf(this.initialFrData.projectId)) {
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
    let user = this.authService.loggedUserInstance;
    let activity = this.initialFrData.activity || [];
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
    let frData = this.fundingRequestForm.value;
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
    let frData = this.fundingRequestForm.value;
    frData.items = this.frItems.map(
      frItem => frItem.getRawObject()
    );
    frData.total = this.getFrTotal();
    frData.clientId = this.clientIdOfSelectedProject;
    this.dialog.open(FrPrintPreviewComponent, {
      data: frData
    });
  }
}
