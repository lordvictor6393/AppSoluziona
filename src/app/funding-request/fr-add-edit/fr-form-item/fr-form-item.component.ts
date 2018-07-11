import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../../node_modules/@angular/material';
import { FundingRequestItem } from './funding-request-item.model';

@Component({
  selector: 'app-fr-form-item',
  templateUrl: './fr-form-item.component.html',
  styleUrls: ['./fr-form-item.component.css']
})
export class FrFormItemComponent implements OnInit {

  isNew: boolean = false;
  frItemForm: FormGroup;
  constructor(private dialog: MatDialogRef<FrFormItemComponent>,
    @Inject(MAT_DIALOG_DATA) private frItemData: FundingRequestItem) { }

  ngOnInit() {
    this.frItemForm = new FormGroup({
      'detail': new FormControl(null),
      'quantity': new FormControl(null),
      'singlePrice': new FormControl(null)
    });

    this.isNew = this.frItemData.detail ? false : true; 
    if (!this.isNew) {
      this.loadFrItem()
    }
  }

  loadFrItem() {
    this.frItemForm.setValue({
      detail: this.frItemData.detail,
      quantity: this.frItemData.quantity,
      singlePrice: this.frItemData.singlePrice
    })
  }

  addFrItem() {
    let itemData = this.frItemForm.value;
    let frItem = new FundingRequestItem(
      itemData.detail,
      +itemData.quantity,
      +itemData.singlePrice,
      this.getTotalPrice(itemData.quantity, itemData.singlePrice));

    this.dialog.close(frItem);
  }

  getTotalPrice(quantity, price) {
    price *= 100;
    return (quantity * price) / 100;
  }
}
