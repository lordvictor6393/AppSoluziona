import { Component, OnInit, ViewChild } from '@angular/core';
import { FundingRequest } from '../funding-request.model';
import { FundingRequestService } from '../funding-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-fr-list',
  templateUrl: './fr-list.component.html',
  styleUrls: ['./fr-list.component.css']
})
export class FrListComponent implements OnInit {

  requests: FundingRequest[];
  frListColumns: string[];
  frDataSource: MatTableDataSource<FundingRequest> = new MatTableDataSource<FundingRequest>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fundingRequestService: FundingRequestService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.frListColumns = [
      'code',
      'detail',
      'createUser',
      // 'projectName',
      'state',
      'editBtn'
    ];
    this.fundingRequestService.getFrList().subscribe(
      frList => {
        this.requests = frList;
        if(this.requests.length) {
          this.frDataSource.data = this.requests;
        }
      }
    );
    this.frDataSource.sort = this.sort;
  }

  onEditFundingRequest(frId: string) {
    this.router.navigate([frId], {
      relativeTo: this.route
    })
  }

  onAddFundingRequest() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

  onDeleteFundingRequest(frId: string) {
    this.fundingRequestService.deleteFr(frId);
  }
}
