import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.css']
})
export class RejectReasonComponent implements OnInit {

  reasonForm: FormGroup;

  constructor(private dialog: MatDialogRef<RejectReasonComponent>) { }

  ngOnInit() {
    this.reasonForm = new FormGroup({
      reason: new FormControl(null)
    });
  }

  returnRejectReason() {
    this.dialog.close(this.reasonForm.value.reason);
  }

}
