import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilesService } from 'app/services/files/files.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalFileUploadComponent } from '../modal-file-upload/modal-file-upload.component';
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { indexDocument } from 'app/_interfaces/document-by-ship.interface';



export interface ShipFile {
  FileId: string,
  FilePath?: string,
  omiNic: string;
  registrationNumber: string;
  shipName: string;
  shipId: number;
}
@Component({
  selector: 'app-load-files',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.scss']

})
export class LoadFilesComponent implements OnInit, AfterViewInit {
  @Input() tabPanel: string;
  @Input() ship: any;

  cargarDocumentoForm: FormGroup;  

  columns: any[];
  rows: any[];
  esExpediente: boolean = null;
  numeroTomo: number;

  constructor(public dialog: MatDialog,
    private downloadService: FilesService,
    private filesServices: FilesService,
    private fb: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) 
    {

      this.cargarDocumentoForm = this.fb.group({
        cargarDocumento: ''
      });
     }

  ngOnInit(): void {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
    this.loadExpedientesData();
  }

 isValidDate(date: any): boolean {
  return !isNaN(new Date(date).getTime());
}
  
  ngAfterViewInit() {
  }

  openDialog(event, isReplace, row, documentType) {
    this.esExpediente = event;

    const fileNameWithExtension = row.fileName; 
    let fileNameWithoutExtension = fileNameWithExtension;

    if (documentType === 'pdf') {
        fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.');
    }

    const objShipFile:  ShipFile = {
      shipId: this.ship.shipId,
      shipName: this.ship.shipName,
      registrationNumber: this.ship.registrationNumber,
      omiNic: this.ship.omiNic,
      FilePath: row.folder,
      FileId: fileNameWithoutExtension
    }
    const objExcelFile: indexDocument = {
        shipId: this.ship.shipId,
        numeroTomo: row.numeroTomo
    }

    const dialogRef = this.dialog.open(ModalFileUploadComponent, {
      width: '700px',
      data: {
         panel: this.tabPanel,
         shipId: this.ship.shipId, 
         esExpediente: isReplace == true ? null : this.esExpediente, 
         objShipFile: objShipFile,
         isReplace: isReplace,
         objExcelFile: objExcelFile,
         documentType: documentType
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dataDetailId = { 'RegistrationNumber': this.ship.registrationNumber };
            this.filesServices.getShipFile(dataDetailId).subscribe(resp => {
            });  
      }
    });
  }

  download(){
    this.downloadService.downloadExcelPlantilla().subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plantilla.xlsx');  // Aquí puedes darle el nombre que desees al archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error al descargar:', error);
      }
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
        this.loadExpedientesData();
    } else if (event.index === 1) {
        this.loadIndicesData();
    }
  }

  loadExpedientesData(){
    const shipId = this.ship.shipId;
    this.filesServices.getAllTomosByShipId(shipId).subscribe(data => {
        this.rows = [...data];

    })
  }

  loadIndicesData(){
    const shipId = this.ship.shipId;
    this.filesServices.GetIndexesOfDocumentsTomoByShip(shipId).subscribe(data => {
        this.rows = [...data];
    })
  }
}
