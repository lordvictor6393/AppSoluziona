import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fr-form-item',
  templateUrl: './fr-form-item.component.html',
  styleUrls: ['./fr-form-item.component.css']
})
export class FrFormItemComponent implements OnInit {

  frItemForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.frItemForm = new FormGroup({});
  }

}
