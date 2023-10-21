import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-print',
  templateUrl: './detail-print.component.html',
  styleUrls: ['./detail-print.component.scss']
})
export class DetailPrintComponent implements OnInit {
@Input() dataDetail: any;
  shipImage: any;
  constructor(    private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.shipImage = (this.dataDetail.base64Photo != '' && this.dataDetail.base64Photo != null && this.dataDetail.base64Photo != undefined) ? this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.dataDetail.base64Photo) : undefined;
  }

}
