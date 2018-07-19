import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '../../../../../node_modules/@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { ExpenseReportItem } from './expense-report-item.model';

@Component({
  selector: 'app-er-form-item',
  templateUrl: './er-form-item.component.html',
  styleUrls: ['./er-form-item.component.css']
})
export class ErFormItemComponent implements OnInit {

  isNew: boolean = false;
  erItemForm: FormGroup;
  constructor(private dialog: MatDialogRef<ErFormItemComponent>,
    @Inject(MAT_DIALOG_DATA) private erItemData: ExpenseReportItem) { }

  ngOnInit() {
    this.erItemForm = new FormGroup({
      detail: new FormControl(null),
      date: new FormControl(null),
      billNumber: new FormControl(null),
      voucherNumber: new FormControl(null),
      quantity: new FormControl(null),
      singlePrice: new FormControl(null)
    });

    this.isNew = this.erItemData.detail ? false : true; 
    if (!this.isNew) {
      this.loadErItem()
    }
  }

  loadErItem() {
    this.erItemForm.setValue({
      detail: this.erItemData.detail,
      date: this.erItemData.date,
      billNumber: this.erItemData.billNumber,
      voucherNumber: this.erItemData.voucherNumber,
      quantity: this.erItemData.quantity,
      singlePrice: this.erItemData.singlePrice
    })
  }

  addErItem() {
    let itemData = this.erItemForm.value;
    let erItem = new ExpenseReportItem(
      itemData.detail,
      itemData.date,
      itemData.billNumber,
      itemData.voucherNumber,
      +itemData.quantity,
      +itemData.singlePrice,
      this.getTotalPrice(itemData.quantity, itemData.singlePrice));

    this.dialog.close(erItem);
  }

  getTotalPrice(quantity, price) {
    price *= 100;
    return (quantity * price) / 100;
  }
}