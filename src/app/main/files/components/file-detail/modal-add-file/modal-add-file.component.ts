import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppCommonService } from 'app/services/app-common/app-common.service';
import { locale as spanish } from './i18n/es';
import { ModalConfirmationComponent } from './../modal-confirmation/modal-confirmation.component'
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { Validations } from './../../../../files/validations';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

export interface DialogData {
  panel: string;
  shipId: string;
}

@Component({
  selector: 'app-modal-add-file',
  templateUrl: './modal-add-file.component.html',
  styleUrls: ['./modal-add-file.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class ModalAddFileComponent implements OnInit {
  fileToUpload: File;
  trafficType: any;
  loadFiles: FormGroup;
  checkDateExpired: boolean = false;
  typeDocEnrollment: any;
  fileBase64: string;
  classCertificate: any;
  classCancelation: any;
  modificationDocumentTypeId: any;
  legalDocumentTypeId: any;
  certificateTypeId: any;
  registrationDocumentTypeId: any[];
  certificateGenerationTypeId: any[];
  inspectionTypeId: any;
  cancellationDocumentTypeId: any;
  dateMax: any;
  count: number = 0;
  constructor(private dialogRef: MatDialogRef<ModalAddFileComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder,
    private commonServices: AppCommonService,
    private datePipe: DatePipe,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) 
  {
  }

  ngOnInit(): void {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
    this.modalForm(this.data.panel);
    this.commonServices.GetDataGenericByName('TiposTrafico').subscribe(resp => {
      this.trafficType = resp;
    });
    this.dateMax = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  modalForm(modalTab: any) {
    switch (modalTab) {
      case 'EnrollmentGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          RegistrationDocumentTypeId: ['', [Validators.required]],
          IssuanceDate: ['', [Validators.required, Validations.dateValidators]]
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('TiposDocMatricula').subscribe(resp => {
          this.typeDocEnrollment = resp;
        });
        break;
      }
      case 'InspectionsGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          InspectionTypeId: ['', [Validators.required]],
          IssuanceDate: ['', [Validators.required, Validations.dateValidators]]
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('TiposInspeccion').subscribe(resp => {
          this.inspectionTypeId = resp;
        });
        break;
      }
      case 'CertificatesGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          ClassDocument: ['', [Validators.required]],
          CertificateTypeId: ['', [Validators.required]],
          CertificateGenerationTypeId: [''],
          IssuanceDate: ['', [Validators.required, Validations.dateValidators]],
          ExpirationDate: ['']
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('ClasesCertificado').subscribe(resp => {
          this.classCertificate = resp;
        });
        this.loadFiles.controls['CertificateTypeId'].disable();
        this.loadFiles.controls['ExpirationDate'].disable();
        this.loadFiles.controls['CertificateGenerationTypeId'].disable();
        this.onChanges();
        break;
      }
      case 'ModificationsGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          ModificationDocumentTypeId: ['', [Validators.required]],
          IssuanceDate: ['', [Validators.required, Validations.dateValidators]]
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('TiposDocModificacion').subscribe(resp => {
          this.modificationDocumentTypeId = resp;
        });
        break;
      }
      case 'LegalGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          LegalDocumentTypeId: ['', [Validators.required]],
          IssuanceDate: ['', [Validators.required, Validations.dateValidators]]
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('TiposDocJuridico').subscribe(resp => {
          this.legalDocumentTypeId = resp;
        });
        break;
      }
      case 'ComunicationGrid': {
        this.loadFiles = this._formBuilder.group({
          Id: [null],
          FileName: ['', [Validators.required]],
          ShipId: ['', [Validators.required]],
          File: ['', [Validators.required]],
          Description: ['', [Validators.required,Validators.maxLength(220)]]
        });
        this.loadFiles.get('ShipId').setValue(this.data.shipId);
        this.commonServices.GetDataGenericByName('TiposDocMatricula').subscribe(resp => {
          this.typeDocEnrollment = resp;
        });
        break;
      }
    }
  }

  loadFile() {
    const loadFilesForm = this.loadFiles.value;
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      width: 'auto',
      data: { loadFile: loadFilesForm, panel: this.data.panel }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
        this.loadFiles.reset();
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
    this.loadFiles.reset();
  }
  loadFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    if (this.fileToUpload.type != 'application/pdf') {
      this.messsageNotification('El formato del archivo seleccionado debe ser PDF.');
    }
    if (this.fileToUpload.size > 26214400) {
      this.messsageNotification('El tamaño del archivo seleccionado debe ser menor a 25MB.');
    }
    this.loadFiles.get('FileName').setValue(this.fileToUpload.name);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      let resultFile = event.target.result.split(',');
      this.loadFiles.get('File').setValue(resultFile[1]);
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  messsageNotification(notification) {
    const config = { data: { title: 'Mensaje del sistema', message: notification, buttonText: 'Aceptar', type: 'warning' } };
    this.dialog.open(FuseMessageDialogComponent, config);
    this.fileToUpload = undefined;
    return false;
  }

  applyDateExpired() {
    this.loadFiles.get('ExpirationDate').setValue(null);
    this.checkDateExpired = !this.checkDateExpired;
    this.checkDateExpired ? this.loadFiles.controls['ExpirationDate'].enable() : this.loadFiles.controls['ExpirationDate'].disable();
  }

  onChanges(): void {
    this.loadFiles.get('ClassDocument').valueChanges.subscribe(value => {
      if (!isNullOrUndefined(value)) {
        if (this.data.panel == 'CertificatesGrid') {
          const classDocumentId = this.loadFiles.get('ClassDocument').value;
          this.commonServices.GetDataGenericBySubLista({ 'Name': 'TiposCertificado', 'ParentId': classDocumentId }).subscribe(resp => {
            this.loadFiles.controls['CertificateTypeId'].enable();
            this.certificateTypeId = resp;
          });
          this.commonServices.GetDataGenericBySubLista({ 'Name': 'TiposGeneracion', 'ParentId': classDocumentId }).subscribe(resp => {
            this.loadFiles.controls['CertificateGenerationTypeId'].enable();
            this.certificateGenerationTypeId = [...resp];
            classDocumentId == 1 ? this.loadFiles.get('CertificateGenerationTypeId').setValue(1) : this.loadFiles.get('CertificateGenerationTypeId').setValue(null);
          });
        }
      }
    });
  }

  countString(){
    this.count = this.loadFiles.value.Description.length;
  }
}
