import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-c-add-edit',
  templateUrl: './c-add-edit.component.html',
  styleUrls: ['./c-add-edit.component.css']
})
export class CAddEditComponent implements OnInit {

  isNew: boolean = false;
  clientForm: FormGroup;
  selectedClient: Client;
  selectedClientId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
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
        if(this.selectedClientId) {
          this.loadClient();
        } else {
          this.isNew = true;
        }
      }
    )
  }

  loadClient() {
    this.clientService.getClient(this.selectedClientId).subscribe(
      (client) => {
        this.selectedClient = client;
        this.clientForm.setValue({
          clientName: client.name,
          clientProjects: client.projectsIds.join(','),
          contactInfo:{
            contactName: client.contactDetails.name,
            contactPhone: client.contactDetails.phone
          }
        });
      }
    )
  }

  onClientSubmit() {
    let formValues = this.clientForm.value;
    let clientData = {
      name: formValues.clientName,
      projectsIds: formValues.clientProjects.split(','),
      contactDetails: {
        name: formValues.contactInfo.contactName,
        phone: formValues.contactInfo.contactPhone
      }
    };
    if(this.isNew) {
      this.clientService.addClient(clientData);
    } else {
      this.clientService.updateClient(clientData);
    }
    this.clientForm.reset();
    this.backToList();
  }

  backToList() {
    this.router.navigate(['/clients']);
  }
}
