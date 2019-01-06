import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  reportCriteriaForm: FormGroup;
  frAndErSummary = [];

  constructor() { }

  ngOnInit() {
    let defaultStartDate = new Date();
    let defaultEndDate = new Date();
    this.reportCriteriaForm = new FormGroup({
      startDate: new FormControl(defaultStartDate, [Validators.required]),
      endDate: new FormControl(defaultEndDate, [Validators.required])
    });
  }

  getFrErSummary() {
    console.log(this.reportCriteriaForm.value);
  }
}
