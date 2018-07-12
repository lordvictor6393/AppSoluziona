import { Component, OnInit, ViewChild } from '@angular/core';
import { FundingRequestItem } from './fr-form-item/funding-request-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../user/user.service';
import { FormGroup } from '@angular/forms';
import { User } from '../../user/user.model';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/client.model';
import { MatDialog, MatTable } from '@angular/material';
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
  frColumnsFooter: string[];
  @ViewChild(MatTable) frItemTable: MatTable<FundingRequestItem>;

  items: FundingRequestItem[] = [
    new FundingRequestItem(
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
    this.frColumns = ['position', 'detail', 'quantity', 'singlePrice', 'totalPrice', 'editBtn'];
    this.frColumnsFooter = ['position', 'detail', 'quantity', 'singlePrice', 'totalPrice'];
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

  getFrTotal() {
    let total = 0;
    this.items.map(
      frItem => total += frItem.totalPrice
    )
    return total;
  }

  addFundingRequestItem(recordData?: FundingRequestItem) {
    let isEditing = recordData ? true : false;
    let itemForm = this.dialog.open(FrFormItemComponent, {
      data: recordData || {}
    });
    itemForm.afterClosed().subscribe(
      frItem => {
        if (frItem) {
          if (isEditing) {
            recordData.updateData(frItem);
          } else {
            this.items.push(frItem);
          }
          console.log(this.items);
          this.frItemTable.renderRows();
        }
      }
    )
  }

  deleteFundingRequestItem(index: number) {
    if (index > -1) {
      this.items.splice(index, 1);
      this.frItemTable.renderRows();
    }
  }
}
