import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../project/project.service';
import { FundingRequest } from '../../../funding-request/funding-request.model';
import { FundingRequestService } from '../../../funding-request/funding-request.service';
import { MatDialogRef } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-fr-selector',
  templateUrl: './fr-selector.component.html',
  styleUrls: ['./fr-selector.component.css']
})
export class FrSelectorComponent implements OnInit {

  selectedFrId: string;
  myFrList: FundingRequest[];

  constructor(private projectService: ProjectService,
    private frService: FundingRequestService,
    private dialog: MatDialogRef<FrSelectorComponent>) { }

  ngOnInit() {
    this.frService.getFrList(true).subscribe(
      frList => {
        this.myFrList = frList;
      }
    );
  }

  onFrSelectionChange(frId: string) {
    this.selectedFrId = frId;
  }

  onFrSelected() {
    this.dialog.close(this.selectedFrId);
  }
}
