import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConsultInspectionsComponent } from '../consult-inspections/consult-inspections.component';
import { InspectionsService } from '../../../../services/inspections/inspections.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NavigationService } from 'app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { routesData } from 'app/routes';
import { DatePipe } from '@angular/common';

// Translations
import { locale as spanish } from './i18n/es';
import { SurveyComponent } from 'app/main/app-common/survey/survey.component';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.scss'],
})
export class InspectionDetailComponent implements OnInit {
  @ViewChild(SurveyComponent) surveyComponent;

  // Inspection information
  allData: any = null;
  inspection: any;
  shipInfo: any = null;
  title: string;
  subTitle: string;
  logo: string;
  process: string;
  version: string;
  code: string;
  note: string;
  resolution: string;
  formatTypes: any;
  selectedFormatType: any;
  readOnlyFormatType: any;
  updatingInspectionType = false;

  /**
   * Constructor
   *
   * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConsultInspectionsComponent>,
    private inspectionsService: InspectionsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    public navigationService: NavigationService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const inspection = this.data.inspection;
    this.allData = await this.inspectionsService.getInspectionDataById(inspection.inspectionId, inspection.shipId, false);
    this.inspection = this.allData.inspection;
    this.shipInfo = this.allData.ship;
    this.formatTypes = JSON.parse(this.inspection.formats.replace(/\n/g, ' '));
    this.readOnlyFormatType = this.inspection.state !== 'P';

    if(this.readOnlyFormatType) {
      this.selectedFormatType = this.inspection.inspectionTypeId;

    } else if (this.formatTypes.length === 1) {
      this.selectedFormatType = this.formatTypes[0].id;
    }
    await this.loadPDFData();
  }

  async loadPDFData(): Promise<void>  {
    const pdfInfo = await this.inspectionsService.getPDFInfo(this.inspection.inspectionId);
    this.note =  pdfInfo.note;
    this.resolution =  pdfInfo.resolution;
    this.title = pdfInfo.title;
    this.subTitle = pdfInfo.subtitle;
    this.process = pdfInfo.process;
    this.code = pdfInfo.code;
    this.version = pdfInfo.version;
    this.logo = pdfInfo.logo;
  }

  transformDate(date): string {
    return this.datePipe.transform(date, 'd/M/yyyy');
  }

  async goToInspection(): Promise<void> {
    await this.updateInspectionType();
    this.closeDialog();
    this.router.navigateByUrl(`${routesData.inspections.root}/${routesData.inspections.formats}`, { state: { inspection: this.inspection } });
  }

  async loadSurvey(returnAnswers): Promise<void> {

    try {
      const surveyJSON = await this.inspectionsService.getAllSectionsForPDF(this.inspection.shipId, this.inspection.inspectionId);

      const survey = JSON.parse(surveyJSON.survey);
      
      let anwers = null;
      if (surveyJSON.answer !== undefined && surveyJSON.answer !== null &&  surveyJSON.answer !== '' &&
      surveyJSON.answer.answer !== undefined && surveyJSON.answer.answer !== null &&  surveyJSON.answer.answer !== '') {
        anwers = JSON.parse(surveyJSON.answer.answer);
      }

      this.surveyComponent.loadSurvey(survey, anwers);
      await this.surveyComponent.saveSurveyToPdf();

      let messageBody: string;
      if (returnAnswers === true) {
        messageBody = await this._fuseTranslationLoaderService.getTranslation('INSPECTION_DETAILS.messagePDF');
      }
      else {
        messageBody = await this._fuseTranslationLoaderService.getTranslation('INSPECTION_DETAILS.messageBlankPDF');
      }
  
      this.surveyComponent.setRendering(false);
      
      const config = { data: { title: 'Información', message: messageBody, buttonText: 'Cerrar', type: 'success' } };
      this.dialog.open(FuseMessageDialogComponent, config);

    } catch (error) {
      console.error('loadPDF', error);
    }
  }

  async createBlankPDF(returnAnswers): Promise<void> {
    await this.updateInspectionType();
    this.surveyComponent.setRendering(true);
    this.loadSurvey(returnAnswers);
  }

  async updateInspectionType(): Promise<void> {
    if(!this.readOnlyFormatType) {
      this.updatingInspectionType = true;
      await this.inspectionsService.updateInspectionType({ inspectionId: this.inspection.inspectionId, inspectionTypeId: this.selectedFormatType});
      this.updatingInspectionType = false;
    }
  }
}
