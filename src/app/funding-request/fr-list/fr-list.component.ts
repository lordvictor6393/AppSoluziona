import { Component, OnInit } from '@angular/core';
import { FundingRequest } from '../funding-request.model';
import { FundingRequestService } from '../funding-request.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fr-list',
  templateUrl: './fr-list.component.html',
  styleUrls: ['./fr-list.component.css']
})
export class FrListComponent implements OnInit {

  requests: FundingRequest[];

  constructor(private requestService: FundingRequestService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.requests = this.requestService.getFundingRequests();
  }

  onEditFundingRequest(fr_id: string) {
    this.router.navigate([fr_id], {
      relativeTo: this.route
    })
  }

}
