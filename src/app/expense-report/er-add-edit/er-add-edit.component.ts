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

@Component({
  selector: 'app-er-add-edit',
  templateUrl: './er-add-edit.component.html',
  styleUrls: ['./er-add-edit.component.css']
})
export class ErAddEditComponent implements OnInit {

  isNew: boolean = false;
  selectedErId: string;
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
    private projectService: ProjectService,
    private clientService: ClientService,
    private userService: UsersService,
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
      projectId: new FormControl(null),
      createUserId: new FormControl(null),
      totalReceived: new FormControl(null),
      observations: new FormControl(null),
      place: new FormControl(null),
      date: new FormControl(null),
      accordance: new FormGroup({
        serviceOrder: new FormControl(null),
        voucher: new FormControl(null),
        receiverUserId: new FormControl(null),
      }),
      aproveUserId: new FormControl(null),
    });

    this.route.params.subscribe(
      params => {
        this.selectedErId = params.id;
        if (this.selectedErId) {
          this.loadExpenseReportData()
        } else {
          this.isNew = true;
          this.expenseReportForm.patchValue({ code: this.expenseReportService.generateErCode() });
          this.erItemsDataSource.data = [];
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
    )
  }

  loadExpenseReportData() {
    this.expenseReportService.getEr(this.selectedErId).subscribe(
      erData => {
        this.initialErData = erData;
        this.selectedUserId = erData.createUserId;
        this.updateCurrentSelectedUser();
        this.expenseReportForm.setValue({
          code: erData.code,
          projectId: erData.projectId,
          createUserId: erData.createUserId,
          totalReceived: erData.totalReceived,
          observations: erData.observations,
          place: erData.place,
          date: erData.date,
          accordance: {
            serviceOrder: erData.accordance.serviceOrder,
            voucher: erData.accordance.voucher,
            receiverUserId: erData.accordance.receiverUserId
          },
          aproveUserId: erData.aproveUserId
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
    )
    return total;
  }

  addExpenseReportItem(recordData?: ExpenseReportItem) {
    let isEditing = recordData ? true : false;
    let itemForm = this.dialog.open(ErFormItemComponent, {
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
    )
  }

  deleteExpenseReportItem(index: number) {
    if (index > -1) {
      this.erItems.splice(index, 1);
      // this.frItemTable.renderRows();
      this.erItemsDataSource.data = this.erItems;
    }
  }

  onSaveEr() {
    let erData = this.expenseReportForm.value;
    erData.items = this.erItems.map(
      erItem => erItem.getRawObject()
    );
    erData.totalSpent = this.getErTotal();
    console.log('report to be saved: ', erData);
    if (this.isNew) {
      this.expenseReportService.addEr(erData);
    } else {
      this.expenseReportService.updateEr(this.selectedErId, erData);
    }
    this.backToErList();
  }

  backToErList() {
    this.router.navigate(['expenseReports']);
  }
}
