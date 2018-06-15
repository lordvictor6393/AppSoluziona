import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-c-add-edit',
  templateUrl: './c-add-edit.component.html',
  styleUrls: ['./c-add-edit.component.css']
})
export class CAddEditComponent implements OnInit {

  clientForm: FormGroup;
  selectedClient: any;
  selectedClientId: string;

  constructor(private route: ActivatedRoute,
              private clientService: ClientService) { }

  ngOnInit() {
    this.clientForm = new FormGroup({
      'clientName': new FormControl(null),
      'contactInfo': new FormGroup({
        'contactName': new FormControl(null),
        'contactPhone': new FormControl(null)
      }),
      'clientProjects': new FormControl(null)
    });
    this.route.params.subscribe(
      params => {
        this.selectedClientId = params.id;
        this.clientService.getClient(this.selectedClientId).subscribe(
          (client) => {
            this.selectedClient = client;
            console.log("client: ", client);
          }
        )
        console.log(this.selectedClientId);
      }
    )
  }

  onClientSubmit() {
    console.log(this.clientForm);
    this.clientForm.reset();
  }
}
