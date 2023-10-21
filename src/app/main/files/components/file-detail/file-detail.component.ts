import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { locale as spanish } from '../../../i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FilesService } from 'app/services/files/files.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isNullOrUndefined } from 'util';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { QueryFilesComponent } from './query-files/query-files.component';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
})

export class FileDetailComponent implements OnInit {
 @ViewChild(QueryFilesComponent, { static: false }) queryFilesComponent: QueryFilesComponent;

  isLoading: boolean = false;
  message: string;
  dataDetailId: any;
  dataDetail: any;
  formDetail: FormGroup;
  shipImage: any;
  typeMessage: boolean;
  print: boolean;
  constructor(private router: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private filesServices: FilesService,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.initForm();
    this.dataDetailId = { 'RegistrationNumber': this.router.snapshot.paramMap.get("id") };
    this.filesServices.getShipFile(this.dataDetailId).subscribe(resp => {
      if (resp) {
        this.sectionDocuments(resp);
        this.dataDetail = resp;
        this.setDataFormDetail(this.dataDetail);
        this.isLoading = false;
        this.typeMessage = this.dataDetail.certificateDocumentsMessage.includes('no tiene');
        this.message = this.dataDetail.certificateDocumentsMessage;
      } else {
        this.isLoading = false;
        const config = { data: { title: 'Mensaje del sistema', message: 'No se encontraron resultados.', buttonText: 'Cerrar', type: 'warning' } };
        this.dialog.open(FuseMessageDialogComponent, config);
      }
    });
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

  tabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {  
      if (!this.queryFilesComponent.isServiceCalled) {
        this.queryFilesComponent.isServiceCalled = true;
      } else {
        this.queryFilesComponent.getIndexByShip();
      }
    }
  }
  
  sectionDocuments(documents) {
    if (!isNullOrUndefined(documents.registrationDocuments)) { documents.registrationDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.inspectionDocuments)) { documents.inspectionDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.certificateDocuments)) { documents.certificateDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.modificationDocuments)) { documents.modificationDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.legalDocuments)) { documents.legalDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.cancellationDocuments)) { documents.cancellationDocuments.forEach(item => { this.convertDate(item); }); }
    if (!isNullOrUndefined(documents.otherDocuments)) { documents.otherDocuments.forEach(item => { this.convertDate(item); }); }
  }

  convertDate(item) {
    item.issuanceDate = !isNullOrUndefined(item.issuanceDate) ? this.datePipe.transform(item.issuanceDate, 'dd/MM/yyyy') : item.issuanceDate;
    item.recordDate = !isNullOrUndefined(item.recordDate) ? this.datePipe.transform(item.recordDate, 'dd/MM/yyyy') : item.recordDate;
    item.expirationDate = !isNullOrUndefined(item.expirationDate) ? this.datePipe.transform(item.expirationDate, 'dd/MM/yyyy') : 'No registra';
  }

  setDataFormDetail(detail: any): void {
    this.shipImage = (detail.base64Photo != '' && detail.base64Photo != null && detail.base64Photo != undefined) ? this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + detail.base64Photo) : undefined;
    this.formDetail.get('ShipName').setValue(detail.shipName);
    this.formDetail.get('NavegationType').setValue(detail.navegationType);
    this.formDetail.get('RegistrationNumber').setValue(detail.registrationNumber);
    this.formDetail.get('RegistrationPort').setValue(detail.registrationPort);
    this.formDetail.get('Owner').setValue(detail.owner);
    this.formDetail.get('OmiNic').setValue(detail.omiNic);
    this.formDetail.get('Mmsi').setValue(detail.mmsi);
    this.formDetail.get('BuiltDate').setValue(this.datePipe.transform(detail.builtDate, 'yyyy'));
    this.formDetail.get('Sleeve').setValue(detail.sleeve);
    this.formDetail.get('OperationStatus').setValue(detail.operationStatus);
    this.formDetail.get('GrossTonnage').setValue(detail.grossTonnage);
    this.formDetail.get('NetTonnage').setValue(detail.netTonnage);
    this.formDetail.get('DeadWeight').setValue(detail.deadWeight);
    this.formDetail.get('PropulsionType').setValue(detail.propulsionType);
    this.formDetail.get('Power').setValue(detail.power);
    this.formDetail.get('Length').setValue(detail.length);
    this.formDetail.get('Letters').setValue(detail.letters);
    this.formDetail.get('Group').setValue(detail.group);
    this.formDetail.get('Subgroup').setValue(detail.subgroup);
    this.formDetail.get('TrafficType').setValue(detail.trafficType);
  }

  windowPrint() {
    this.print = true;
    setTimeout(() => { window.print(); this.print = false;}, 500);
  }

  initForm() {
    this.formDetail = this._formBuilder.group({
      RegistrationNumber: [''],
      ShipId: [''],
      ShipName: [''],
      OmiNic: [''],
      Mmsi: [''],
      GrossTonnage: [''],
      MinGrossTonnage: [''],
      MaxGrossTonnage: [''],
      NetTonnage: [''],
      MinNetTonnage: [''],
      MaxNetTonnage: [''],
      RegistrationPort: [''],
      BuiltDate: [''],
      MinBuiltDate: [''],
      MaxBuiltDate: [''],
      OperationStatus: [''],
      NavegationType: [''],
      Owner: [''],
      TrafficType: [''],
      Group: [''],
      Sleeve: [''],
      Length: [''],
      Subgroup: [''],
      PropulsionType: [''],
      Power: [''],
      Letters: [''],
      DeadWeight: ['']
    });
  }
}
