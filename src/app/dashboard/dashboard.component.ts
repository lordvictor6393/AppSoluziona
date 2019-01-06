import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  reportCriteriaForm: FormGroup;
  frErSummary = [];
  frErSummaryColumns = [
    'userName',
    'frCount',
    'totalRequested',
    'frWithoutErCount',
    'totalWithoutReport',
    'frRejectedCount',
    'frApprovedCount',
    'erCount',
    'totalRequested',
    'erRejectedCount',
    'erApprovedCount'
  ];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    this.reportCriteriaForm = new FormGroup({
      startDate: new FormControl(defaultStartDate, [Validators.required]),
      endDate: new FormControl(defaultEndDate, [Validators.required])
    });
  }

  getFrErSummary() {
    const data = this.reportCriteriaForm.value;
    this.frErSummary = this.dashboardService.GetFrErSummary(
      data.startDate,
      data.endDate
    );
  }
}
