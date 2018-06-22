import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-c-list',
  templateUrl: './c-list.component.html',
  styleUrls: ['./c-list.component.css']
})
export class CListComponent implements OnInit {

  clients: Client[];

  constructor(private clientService: ClientService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.clientService.getClientList()
      .subscribe(
        clientsList => {
          this.clients = clientsList;
        }
      );
  }

  onEditClient(clientId: string) {
    this.router.navigate([clientId], {
      relativeTo: this.route
    });
  }

  onAddClient() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }
}
