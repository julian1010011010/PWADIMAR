import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FilesService } from 'app/services/files/files.service';
import { locale as spanish } from '../../consult-files/i18n/es';
export interface DialogData {
  panel: any;
  loadFile: any;
}

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {
  isLoading: boolean = false;;


  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ModalConfirmationComponent>,
    private filesServices: FilesService, @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { }

  ngOnInit(): void {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

  onSiClick() {
    this.isLoading = true;
    switch (this.data.panel) {
      case 'EnrollmentGrid': 
        this.filesServices.insertRegistrationDocument(this.data.loadFile).subscribe(
          resp => { this.modalNotification(true); this.isLoading = false},
          error => { this.modalNotification(false); this.isLoading = false}
        );
        break;
      case 'InspectionsGrid':
        this.filesServices.insertInspectionDocument(this.data.loadFile).subscribe(
          resp => { this.modalNotification(true); this.isLoading = false},
          error => { this.modalNotification(false); this.isLoading = false}
        );
        break;
      case 'CertificatesGrid':
        this.filesServices.insertCertificateDocument(this.data.loadFile).subscribe(
          resp => { this.modalNotification(true); this.isLoading = false},
          error => { this.modalNotification(false); this.isLoading = false}
        );
        break;
      case 'ModificationsGrid': 
      this.filesServices.insertModificationDocument(this.data.loadFile).subscribe(
        resp => { this.modalNotification(true); this.isLoading = false},
        error => { this.modalNotification(false); this.isLoading = false}
      );
      break;
      case 'LegalGrid': 
      this.filesServices.insertLegalDocument(this.data.loadFile).subscribe(
        resp => { this.modalNotification(true); this.isLoading = false},
        error => { this.modalNotification(false); this.isLoading = false}
      );
      break;
      case 'ComunicationGrid': 
      this.filesServices.insertOtherDocument(this.data.loadFile).subscribe(
        resp => { this.modalNotification(true); this.isLoading = false},
        error => { this.modalNotification(false); this.isLoading = false}
      );
      break;
    }
  }
  onNoClick() {
    this.dialogRef.close(false);
  }

  modalNotification(message: boolean) {
    const modalMsg = message ? 'Archivo cargado con éxito' : 'Falla en la carga del archivo';
    const modalType = message ? 'success' : 'error';
    const config = { data: { title: 'Mensaje del sistema', message: modalMsg, buttonText: 'Aceptar', type: modalType } };
    this.dialog.open(FuseMessageDialogComponent, config);
    this.dialogRef.close(message);
  }
}
