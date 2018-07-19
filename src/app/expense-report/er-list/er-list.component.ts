import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseReportService } from '../expense-report.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ExpenseReport } from '../expense-report.model';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-er-list',
  templateUrl: './er-list.component.html',
  styleUrls: ['./er-list.component.css']
})
export class ErListComponent implements OnInit {

  reports: ExpenseReport[];
  erListColumns: string[];
  erDataSource: MatTableDataSource<ExpenseReport> = new MatTableDataSource<ExpenseReport>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private expenseReportService: ExpenseReportService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.erListColumns = [
      'code',
      // 'projectName',
      'createUser',
      'totalSpent',
      'totalReceived',
      'balance',
      'state',
      'editBtn'
    ];
    this.expenseReportService.getErList().subscribe(
      erList => {
        this.reports = erList;
        if(this.reports.length) {
          this.erDataSource.data = this.reports;
        }
      }
    );
    this.erDataSource.sort = this.sort;
  }

  onEditExpenseReport(erId: string) {
    this.router.navigate([erId], {
      relativeTo: this.route
    })
  }

  onAddExpenseReport() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  onDeleteExpenseReport(erId: string) {
    this.expenseReportService.deleteEr(erId);
  }
}
