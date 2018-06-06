import { Component, OnInit } from '@angular/core';
import { FundingRequestItem } from './fr-form-item/funding-request-item.model';

@Component({
  selector: 'app-fr-add-edit',
  templateUrl: './fr-add-edit.component.html',
  styleUrls: ['./fr-add-edit.component.css']
})
export class FrAddEditComponent implements OnInit {

  items: FundingRequestItem[] = [
    new FundingRequestItem(
      '1',
      'Materiales',
      2,
      50,
      100
    )
  ];
  constructor() { }

  ngOnInit() {
  }

}
