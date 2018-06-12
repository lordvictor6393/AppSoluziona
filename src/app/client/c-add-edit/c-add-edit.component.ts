import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-c-add-edit',
  templateUrl: './c-add-edit.component.html',
  styleUrls: ['./c-add-edit.component.css']
})
export class CAddEditComponent implements OnInit {

  clientForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.clientForm = new FormGroup({
      'clientName': new FormControl(null),
      'contactInfo': new FormGroup({
        'contactName': new FormControl(null),
        'contactPhone': new FormControl(null)
      }),
      'clientProjects': new FormControl(null)
    });
  }

  onClientSubmit() {
    console.log(this.clientForm);
    this.clientForm.reset();
  }
}
