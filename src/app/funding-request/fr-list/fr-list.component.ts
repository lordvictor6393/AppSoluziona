import { Component, OnInit, ViewChild } from '@angular/core';
import { FundingRequest } from '../funding-request.model';
import { FundingRequestService } from '../funding-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-fr-list',
  templateUrl: './fr-list.component.html',
  styleUrls: ['./fr-list.component.css']
})
export class FrListComponent implements OnInit {

  requests: FundingRequest[];
  frColumns: string[];
  frDataSource: MatTableDataSource<FundingRequest>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private requestService: FundingRequestService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.frColumns = [
      'id',
      'detail',
      'createUser',
      'projectName',
      'state',
      'editBtn'
    ];
    this.requests = this.requestService.getFundingRequests();
    this.frDataSource = new MatTableDataSource(this.requests);
    this.frDataSource.sort = this.sort;
  }

  onEditFundingRequest(fr_id: string) {
    this.router.navigate([fr_id], {
      relativeTo: this.route
    })
  }

}
