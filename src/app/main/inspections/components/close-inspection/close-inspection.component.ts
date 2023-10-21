import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Translations
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '../../../../../@fuse/services/translation-loader.service';
import { ConclusionsComponent } from '../conclusions/conclusions.component';
import { SurveyComponent } from 'app/main/app-common/survey/survey.component';
import { InspectionsService } from 'app/services/inspections/inspections.service';
import { Router } from '@angular/router';
import { routesData } from 'app/routes';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-close-inspection',
  templateUrl: './close-inspection.component.html',
  styleUrls: ['./close-inspection.component.scss'],
})
export class CloseInspectionComponent implements OnInit {

  @ViewChild(SurveyComponent) surveyComponent;
  @ViewChild(ConclusionsComponent) conclusionsComp: ConclusionsComponent;

  data: any;
  title: string;
  savingData = false;
  errorMsg: string;
  successSave = false;
  saveBtnText = 'Guardar';
  showSave = false;
  isSaveActive = false;
  inspection: any;
  finalState = false;
  //
  downloadPDF = false;
  savePressed = false;
  pdfTitle: string;
  subTitle: string;
  logo: string;
  process: string;
  version: string;
  code: string;
  note: string;
  resolution: string;

  constructor(
    private inspectionsService: InspectionsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);

    this.data = this.router.getCurrentNavigation().extras.state.data;
    this.inspection = this.data.inspection;
    this.finalState = this.data.finalState;
  }

  ngOnInit(): void {
    if (this.data.saveBtnText) {
      this.saveBtnText = this.data.saveBtnText;
    }

    if (this.data.downloadPDF) {
      this.loadPDFData();
    }
  }

  save(): void {
    if (this.data.showConclusions) {
      this.savePressed = true;
      this.conclusionsComp.saveConclusions();
    }
  }

  goBack(): void {
    this.router.navigateByUrl(`${routesData.inspections.root}/${routesData.inspections.formats}`, { state: { inspection: this.inspection.inspection } });
  }

  async loadSurvey(event): Promise<void> {
    let savedAll: any = {};
    if (this.downloadPDF) {
      savedAll = await this.inspectionsService.generateInspectionPDF(this.surveyComponent, this.inspection.inspection);
    }
    const message = savedAll.success ? 'Datos guardados con exito' : savedAll.error;
    const type = savedAll.success ? 'success' : 'error';
    const config = { 
        data: { 
          title: 'Mensaje', 
          message,
          type,
          buttonText: 'Aceptar'
        } 
    };
    this.dialog.open(FuseMessageDialogComponent, config);
  }

  async loadPDFData(): Promise<void> {
    const pdfInfo = await this.inspectionsService.getPDFInfo(this.inspection.inspection.inspectionId);
    this.note = pdfInfo.note;
    this.resolution = pdfInfo.resolution;
    this.pdfTitle = pdfInfo.title;
    this.subTitle = pdfInfo.subtitle;
    this.process = pdfInfo.process;
    this.code = pdfInfo.code;
    this.version = pdfInfo.version;
    this.logo = pdfInfo.logo;
    this.downloadPDF = true;
  }

  async pdfGenerated(data): Promise<void> {
  }
}
