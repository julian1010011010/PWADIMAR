import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilesService } from 'app/services/files/files.service';
import { isNullOrUndefined } from 'util';
import { ModalAddFileComponent } from '../modal-add-file/modal-add-file.component';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.scss']
})
export class UploadedFilesComponent implements OnInit, AfterViewInit {
  @Input() tabPanel: string;
  @Input() ship: any;
  columns: any[];
  rows: any[];
  constructor(public dialog: MatDialog,
    private filesServices: FilesService,
    private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.renderGrid(this.tabPanel);
  }
  ngAfterViewInit() {
  }
  openDialog() {
    const dialogRef = this.dialog.open(ModalAddFileComponent, {
      width: '700px',
      data: { panel: this.tabPanel, shipId: this.ship.shipId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dataDetailId = { 'RegistrationNumber': this.ship.registrationNumber };
        this.filesServices.getShipFile(dataDetailId).subscribe(resp => {
          let documentsData = this.refreshGrid(this.tabPanel, resp);
          if (!isNullOrUndefined(documentsData)) {
            documentsData.forEach(item => {
              item.issuanceDate = !isNullOrUndefined(item.issuanceDate) ? this.datePipe.transform(item.issuanceDate, 'dd/MM/yyyy') : item.issuanceDate;
              item.recordDate = !isNullOrUndefined(item.recordDate) ? this.datePipe.transform(item.recordDate, 'dd/MM/yyyy') : item.recordDate;
              item.expirationDate = !isNullOrUndefined(item.expirationDate) ? this.datePipe.transform(item.expirationDate, 'dd/MM/yyyy') : 'No registra';
            });
            this.rows = [...documentsData];
          }
        });
      }
    });
  }

  refreshGrid(tabPanel, respData) {
    let returnResp = undefined;
    switch (tabPanel) {
      case 'EnrollmentGrid': returnResp = respData.registrationDocuments;
        break;
      case 'InspectionsGrid': returnResp = respData.inspectionDocuments;
        break;
      case 'CertificatesGrid': returnResp = respData.certificateDocuments;
        break;
      case 'ModificationsGrid': returnResp = respData.modificationDocuments;
        break;
      case 'LegalGrid': returnResp = respData.legalDocuments;
        break;
      case 'ComunicationGrid': returnResp = respData.otherDocuments;
        break;
    }
    return returnResp;
  }

  renderGrid(tabPanel) {
    if (tabPanel == 'EnrollmentGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'registrationDocumentType', name: 'Tipo de archivo' },
        { prop: 'issuanceDate', name: 'Fecha de elaboración' },
        { prop: 'recordDate', name: 'Fecha de registro' }
      ];
      this.rows = this.ship.registrationDocuments;
    }
    if (tabPanel == 'ModificationsGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'modificationDocumentType', name: 'Documento' },
        { prop: 'issuanceDate', name: 'Fecha de elaboración' },
        { prop: 'recordDate', name: 'Fecha de registro' }
      ];
      this.rows = this.ship.modificationDocuments;
    }
    if (tabPanel == 'LegalGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'legalDocumentType', name: 'Tipo de documento' },
        { prop: 'issuanceDate', name: 'Fecha de elaboración' },
        { prop: 'recordDate', name: 'Fecha de registro' }
      ];
      this.rows = this.ship.legalDocuments;
    }
    if (tabPanel == 'InspectionsGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'inspectionType', name: 'Tipo de inspección' },
        { prop: 'issuanceDate', name: 'Fecha de elaboración' },
        { prop: 'recordDate', name: 'Fecha de registro' }
      ];
      this.rows = this.ship.inspectionDocuments;
    }
    if (tabPanel == 'CertificatesGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'certificateType', name: 'Certificado' },
        { prop: 'certificateGenerationType', name: 'Tipo generación' },
        { prop: 'issuanceDate', name: 'Fecha de elaboración' },
        { prop: 'expirationDate', name: 'Fecha de vencimiento' }
      ];
      this.rows = this.ship.certificateDocuments;
    }
    if (tabPanel == 'ComunicationGrid') {
      this.columns = [
        { prop: 'fileName', name: 'Nombre archivo' },
        { prop: 'description', name: 'Descripción' },
        { prop: 'recordDate', name: 'Fecha de registro' }
      ];
      this.rows = this.ship.otherDocuments;
    }
  }

  redirection(row) {
    this.router.navigateByUrl("/expedientes/documento", { state: { registrationNumber: this.ship.registrationNumber, file: row.file } });
  }

}
