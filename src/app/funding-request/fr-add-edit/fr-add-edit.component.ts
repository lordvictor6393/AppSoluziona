import { Component, OnInit } from '@angular/core';
import { FundingRequestItem } from './fr-form-item/funding-request-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../user/user.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fr-add-edit',
  templateUrl: './fr-add-edit.component.html',
  styleUrls: ['./fr-add-edit.component.css']
})
export class FrAddEditComponent implements OnInit {

  fundingRequestForm: FormGroup;
  currentUser = {
    fullName: 'victor vasquez'
  };
  items: FundingRequestItem[] = [
    new FundingRequestItem(
      '1',
      'Materiales',
      2,
      50,
      100
    )
  ];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService) { }

  ngOnInit() {
    this.fundingRequestForm = new FormGroup({

    });
  }

}
