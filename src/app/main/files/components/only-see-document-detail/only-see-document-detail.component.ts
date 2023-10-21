import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as spanish } from './i18n/es';
@Component({
  selector: 'app-only-see-document-detail',
  templateUrl: './only-see-document-detail.component.html',
  styleUrls: ['./only-see-document-detail.component.scss']
})
export class OnlySeeDocumentDetailComponent implements OnInit {
  registrationNumbers: string;
  currentPdf: any;
  data: any;
  nameDocument: string;
  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,private router: Router) { 
  this.data = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
    this.registrationNumbers = this.data.registrationNumber;
    this.currentPdf = this.data.file;
    this.nameDocument = this.data.nameDocument;
  }

  detailDocument() {
    const linkSourceData = 'data:application/pdf;base64,' + this.currentPdf;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);//requerido en firefox
    const fileName = "DetailFile";
    downloadLink.href = linkSourceData;
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
  }
}