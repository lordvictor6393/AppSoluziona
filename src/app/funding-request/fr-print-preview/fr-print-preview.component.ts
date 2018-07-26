import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { FundingRequest } from '../funding-request.model';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-fr-print-preview',
  templateUrl: './fr-print-preview.component.html',
  styleUrls: ['./fr-print-preview.component.css']
})
export class FrPrintPreviewComponent implements OnInit {

  @ViewChild('frPrintPreview') frPrintPreview: ElementRef;
  constructor(private dialog: MatDialogRef<FrPrintPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) private fr: FundingRequest) { }

  ngOnInit() {
  }

  downloadPDF() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };
    let content = this.frPrintPreview.nativeElement;
    console.log(content);

    // html2canvas(content).then(
    //   canvas => {
        // doc.fromHTML(canvas,15,15,{
        //   'width': 190,
        //   'elementHandlers': specialElementHandlers
        // });
        // window.html2canvas = html2canvas;
        // doc.addHTML(content, () => {
        //   doc.save('itWorks.pdf');
        // });
      // }
    // )
  }

}
