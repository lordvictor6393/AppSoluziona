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
  selectedUserId: string;
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
              this.expenseReportForm.patchValue({ code: this.expenseReportService.generateErCode(frInstance.code) });
            }
          );
        }
      }
    );

    this.erItemsDataSource.sort = this.sort;
    this.erGridColumns = [
      'position',
      'detail',
      'date',
      'billNumber',
      'voucherNumber',
      'quantity',
      'singlePrice',
      'totalPrice',
      'editBtn'
    ];
  }

  updateCurrentSelectedUser() {
    this.selectedUser = this.users.find(
      userElement => userElement.id === this.selectedUserId
    );
  }

  loadExpenseReportData() {
    this.expenseReportService.getEr(this.selectedErId).subscribe(
      erData => {
        this.initialErData = erData;
        this.selectedFrId = erData.frId;
        this.selectedUserId = erData.createUserId;
        this.updateCurrentSelectedUser();
        this.fundingRequestService.getFr(this.selectedFrId).subscribe(
          frInstance => this.selectedFr = frInstance
        );
        this.expenseReportForm.setValue({
          code: erData.code,
          createUserId: erData.createUserId,
          totalReceived: erData.totalReceived,
          observations: erData.observations,
          place: erData.place,
          date: erData.date,
          accordance: {
            serviceOrder: erData.accordance.serviceOrder,
            voucher: erData.accordance.voucher,
            receiverUserId: erData.accordance.receiverUserId
          }
        });

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
      erItem => total += erItem.totalPrice
    );
    return total;
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
      this.expenseReportService.sendEr(this.initialErData.id, activity);
    }
    this.backToErList();
  }

  onApproveEr() {
    const user = this.authService.loggedUserInstance;
    const activity = this.initialErData.activity || [];
    if (user && this.initialErData.isSent) {
      if (user.leadOf.indexOf(this.initialErData.projectId)) {
        activity.push({
          action: SZ.VERIFIED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
        this.expenseReportService.verifyEr(this.initialErData.id, activity);
      } else if (this.authService.CanManageAllFrEr()) {
        activity.push({
          action: SZ.APPROVED,
          userId: this.authService.getLoggedUserId(),
          date: new Date().getTime()
        });
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
