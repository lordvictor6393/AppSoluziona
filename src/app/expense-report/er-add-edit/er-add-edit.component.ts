import * as SZ from '../../globalConstants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseReport } from '../expense-report.model';
import { User } from '../../user/user.model';
import { Client } from '../../client/client.model';
import { Project } from '../../project/project.model';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';
import { MatTableDataSource, MatSort, MatTable, MatDialog } from '../../../../node_modules/@angular/material';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ExpenseReportService } from '../expense-report.service';
import { ProjectService } from '../../project/project.service';
import { ClientService } from '../../client/client.service';
import { UsersService } from '../../user/user.service';
import { ErFormItemComponent } from './er-form-item/er-form-item.component';
import { ExpenseReportItem } from './er-form-item/expense-report-item.model';
import { AuthService } from '../../auth/auth.service';
import { RejectReasonComponent } from '../../funding-request/reject-reason/reject-reason.component';
import { FundingRequestService } from '../../funding-request/funding-request.service';
import { FundingRequest } from '../../funding-request/funding-request.model';
import { ErPrintPreviewComponent } from '../er-print-preview/er-print-preview.component';
import { combineLatest } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-er-add-edit',
  templateUrl: './er-add-edit.component.html',
  styleUrls: ['./er-add-edit.component.scss']
})
export class ErAddEditComponent implements OnInit {

  isNew = false;
  selectedErId: string;
  selectedFrId: string;
  selectedFr: FundingRequest;
  initialErData: ExpenseReport;

  users: User[] = [];
  clients: Client[] = [];
  projects: Project[] = [];
  expenseReportForm: FormGroup;

  selectedUser: User;
  paymentTypes = ['Efectivo', 'Cheque', 'Transferencia'];

  erGridColumns: string[];
  erItems: ExpenseReportItem[] = [];
  erItemsDataSource: MatTableDataSource<ExpenseReportItem> = new MatTableDataSource<ExpenseReportItem>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) frItemTable: MatTable<ExpenseReportItem>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private expenseReportService: ExpenseReportService,
    private fundingRequestService: FundingRequestService,
    private projectService: ProjectService,
    private clientService: ClientService,
    private userService: UsersService,
    public authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.expenseReportForm = new FormGroup({
      code: new FormControl(null),
      createUserId: new FormControl(null),
      totalReceived: new FormControl(null),
      observations: new FormControl(null),
      place: new FormControl(null),
      date: new FormControl(null),
      accordance: new FormGroup({
        serviceOrder: new FormControl(null),
        voucher: new FormControl(null),
        receiverUserId: new FormControl(null),
      })
    });

    this.erGridColumns = [
      'position',
      'detail',
      'date',
      'billNumber',
      'voucherNumber',
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
              this.selectedErId = params.id;
              this.selectedFrId = params.frId;
              if (this.selectedErId) {
                this.loadExpenseReportData();
              } else {
                this.isNew = true;
                this.erItemsDataSource.data = [];
                this.fundingRequestService.getFr(this.selectedFrId).subscribe(
                  frInstance => {
                    this.selectedFr = frInstance;
                    this.expenseReportForm.patchValue({
                      code: this.expenseReportService.generateErCode(frInstance.code),
                      createUserId: this.authService.loggedUserId
                    });
                    this.updateCurrentSelectedUser();
                    this.erGridColumns.push('editBtn');
                  }
                );
              }
            }
          );
        }
      );

    // this.erItemsDataSource.sort = this.sort;
  }

  updateCurrentSelectedUser() {
    this.selectedUser = this.users.find(
      userElement => userElement.id === this.expenseReportForm.get('createUserId').value
    );
  }

  loadExpenseReportData() {
    this.expenseReportService.getEr(this.selectedErId).subscribe(
      erData => {
        this.initialErData = erData;
        this.selectedFrId = erData.frId;
        this.fundingRequestService.getFr(this.selectedFrId).subscribe(
          frInstance => this.selectedFr = frInstance
        );
        const patch = {};
        if (erData.code) { patch['code'] = erData.code; }
        if (erData.createUserId) { patch['createUserId'] = erData.createUserId; }
        if (erData.totalReceived) { patch['totalReceived'] = erData.totalReceived; }
        if (erData.date) { patch['date'] = erData.date; }
        if (erData.place) { patch['place'] = erData.place; }
        if (erData.observations) { patch['observations'] = erData.observations; }
        if (erData.accordance) {
          patch['accordance'] = {};
          if (erData.accordance.serviceOrder) { patch['accordance']['serviceOrder'] = erData.accordance.serviceOrder; }
          if (erData.accordance.voucher) { patch['accordance']['voucher'] = erData.accordance.voucher; }
          if (erData.accordance.receiverUserId) { patch['accordance']['receiverUserId'] = erData.accordance.receiverUserId; }
        }
        this.expenseReportForm.patchValue(patch);
        this.updateCurrentSelectedUser();
        if (!this.initialErData.isSent) {
          this.erGridColumns.push('editBtn');
        }
        this.erItems = erData.items.map(
          erItemData => new ExpenseReportItem(
            erItemData.detail,
            erItemData.date,
            erItemData.billNumber,
            erItemData.voucherNumber,
            erItemData.quantity,
            erItemData.singlePrice,
            erItemData.totalPrice
          )
        );
        if (this.erItems.length) {
          this.erItemsDataSource.data = this.erItems;
        }
      }
    );
  }

  getErTotal() {
    let total = 0;
    this.erItems.map(
      erItem => total += (erItem.totalPrice * 10)
    );
    return total / 10;
  }

  canBeModified() {
    let allowed = this.isNew;
    if (this.initialErData) {
      allowed = allowed || !this.initialErData.isSent;
      // allowed = allowed || (this.authService.CanManageAllFrEr() && this.initialErData.state === SZ.VERIFIED);
    }
    return allowed;
  }

  addExpenseReportItem(recordData?: ExpenseReportItem) {
    const isEditing = recordData ? true : false;
    const itemForm = this.dialog.open(ErFormItemComponent, {
      data: recordData || {}
    });
    itemForm.afterClosed().subscribe(
      erItem => {
        if (erItem) {
          if (isEditing) {
            recordData.updateData(erItem);
          } else {
            this.erItems.push(erItem);
          }
          // this.frItemTable.renderRows();
          this.erItemsDataSource.data = this.erItems;
        }
      }
    );
  }

  deleteExpenseReportItem(index: number) {
    if (index > -1) {
      this.erItems.splice(index, 1);
      // this.frItemTable.renderRows();
      this.erItemsDataSource.data = this.erItems;
    }
  }

  onSendEr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialErData.activity || [];
    if (user && !this.initialErData.isSent) {
      activity.push({
        action: SZ.SENT,
        userId: this.authService.getLoggedUserId(),
        date: new Date().getTime()
      });
      this.onSaveEr();
      this.expenseReportService.sendEr(this.initialErData.id, activity);
    }
    this.backToErList();
  }

  onVerifyEr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialErData.activity || [];
    if (user && this.initialErData.isSent) {
      if (this.authService.CanVerifyEr(this.initialErData)) {
        activity.push({
          action: SZ.VERIFIED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.onSaveEr();
        this.expenseReportService.verifyEr(this.initialErData.id, activity);
      }
    }
  }

  onApproveEr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialErData.activity || [];
    if (user && this.initialErData.isSent) {
      if (this.authService.CanApproveEr(this.initialErData)) {
        activity.push({
          action: SZ.APPROVED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.onSaveEr();
        this.expenseReportService.approveEr(this.initialErData.id, activity);
      }
    }
  }

  onRejectEr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialErData.activity || [];
    if (user && this.initialErData.isSent) {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe(
        reason => {
          if (reason) {
            activity.push({
              action: SZ.REJECTED,
              userId: this.authService.getLoggedUserId(),
              date: new Date().getTime(),
              reason: reason
            });
            this.onSaveEr();
            this.expenseReportService.rejectEr(this.initialErData.id, activity);
          }
        }
      );
    }
  }

  onSaveEr() {
    const erData = this.expenseReportForm.value;
    erData.items = this.erItems.map(
      erItem => erItem.getRawObject()
    );
    erData.frId = this.selectedFrId;
    erData.projectId = this.selectedFr.projectId;
    erData.totalSpent = this.getErTotal();
    erData.totalReceived = this.selectedFr.total;
    erData.balance = erData.totalReceived - erData.totalSpent;
    // erData.date = erData.date.getTime();
    console.log('report to be saved: ', erData);
    if (this.isNew) {
      this.expenseReportService.addEr(erData);
    } else {
      this.expenseReportService.updateEr(this.selectedErId, erData);
    }
    this.backToErList();
  }

  onDeleteEr() {
    this.expenseReportService.deleteEr(this.selectedErId);
  }

  backToErList() {
    this.router.navigate(['expenseReports']);
  }

  showErPreview() {
    const erData = this.expenseReportForm.value;
    erData.items = this.erItems.map(
      erItem => erItem.getRawObject()
    );
    erData.frId = this.selectedFrId;
    erData.projectId = this.selectedFr.projectId;
    erData.totalSpent = this.getErTotal();
    erData.totalReceived = this.selectedFr.total;
    erData.balance = erData.totalReceived - erData.totalSpent;
    this.dialog.open(ErPrintPreviewComponent, {
      data: {
        er: erData,
        users: this.users,
        fr: this.selectedFr,
        clients: this.clients,
        projects: this.projects
      }
    });
  }
}
