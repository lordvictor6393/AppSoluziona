import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseReportService } from '../expense-report.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ExpenseReport } from '../expense-report.model';
import { MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-er-list',
  templateUrl: './er-list.component.html',
  styleUrls: ['./er-list.component.css']
})
export class ErListComponent implements OnInit {

  requests: ExpenseReport[];
  erListColumns: string[];
  erDataSource: MatTableDataSource<ExpenseReport> = new MatTableDataSource<ExpenseReport>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private expenseReportService: ExpenseReportService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.erListColumns = [
      'code',
      // 'projectName',
      'detail',
      'createUser',
      'state',
      'editBtn'
    ];
    this.expenseReportService.getErList().subscribe(
      frList => {
        this.requests = frList;
        if(this.requests.length) {
          this.erDataSource.data = this.requests;
        }
      }
    );
    this.erDataSource.sort = this.sort;
  }

  onEditFundingRequest(frId: string) {
    this.router.navigate([frId], {
      relativeTo: this.route
    })
  }

  onAddFundingRequest() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  onDeleteFundingRequest(frId: string) {
    this.expenseReportService.deleteEr(frId);
  }
}
