import { Component, OnInit } from '@angular/core';
import { FundingRequestItem } from './fr-form-item/funding-request-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../user/user.service';
import { FormGroup } from '@angular/forms';
import { User } from '../../user/user.model';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/client.model';
import { MatDialog } from '@angular/material';
import { FrFormItemComponent } from './fr-form-item/fr-form-item.component';

@Component({
  selector: 'app-fr-add-edit',
  templateUrl: './fr-add-edit.component.html',
  styleUrls: ['./fr-add-edit.component.css']
})
export class FrAddEditComponent implements OnInit {

  users: User[];
  clients: Client[];
  selectedUserId: string;
  selectedClientId: string;
  fundingRequestForm: FormGroup;
  currentUser: User;
  // TODO remove if confirm that is not needed
  currentClient: Client;

  frColumns: string[];

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
    private clientService: ClientService,
    private userService: UsersService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fundingRequestForm = new FormGroup({

    });
    this.initializeFundingRequestData();
  }

  initializeFundingRequestData() {
    this.frColumns = ['position', 'detail', 'quantity', 'singlePrice', 'totalPrice'];
    this.userService.getUserList().subscribe(
      usersList => this.users = usersList
    )
    this.clientService.getClientList().subscribe(
      clientList => this.clients = clientList
    )
  }

  updateCurrentSelectedUser() {
    this.currentUser = this.users.find(
      userElement => userElement.id === this.selectedUserId
    )
  }

  // TODO remove if confirm that is not needed
  updateCurrentSelectedClient() {
    this.currentClient = this.clients.find(
      clientElement => clientElement.id === this.selectedClientId
    )
  }

  addFundingRequestItem() {
    let itemForm = this.dialog.open(FrFormItemComponent, {
      width: '80%'
    });

  }
}
