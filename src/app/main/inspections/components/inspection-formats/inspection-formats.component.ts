import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SurveyComponent } from 'app/main/app-common/survey/survey.component';
import { routesData } from 'app/routes';
import { InspectionsService } from 'app/services/inspections/inspections.service';
import { ModalInspectionGenericComponent } from '../modal-inspection-generic/modal-inspection-generic.component';

// Translations
import { locale as spanish } from './i18n/es';

@Component({
    selector: 'inspection-formats',
    templateUrl: './inspection-formats.component.html',
    styleUrls: ['./inspection-formats.component.scss'],
})
export class InspectionFormatsComponent implements OnInit {

    @ViewChild('surveyPdf') surveyComponent: SurveyComponent;
    
    // Variables
    sections = null;
    inspectionData: any = {};
    surveySaveBtn = '';
    shipInformation: any = {};
    inspection: any = {};
    finalState = false;
    shipFileToUpload: any = null;
    uploadingFile = false;
    closingInspection = false;
    closedSuccessfully = false;
    errorMsg = null;

    // for the pdf
    downloadPDF = false;
    pdfTitle: string;
    subTitle: string;
    logo: string;
    process: string;
    version: string;
    code: string;
    note: string;
    resolution: string;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private inspectionsService: InspectionsService,
        private router: Router,
        public dialog: MatDialog
    ) {
        this._fuseTranslationLoaderService.loadTranslations(spanish);

        // get the inspection data
        this.inspectionData = this.router.getCurrentNavigation().extras.state.inspection;
    }

    ngOnInit(): void {
        this.loadSections();
    }

    async loadSections(): Promise<void> {

        this.surveySaveBtn = await this._fuseTranslationLoaderService.getTranslation('INSPECTION_FORMATS.SURVEY_SAVE');

        try {
            this.inspection = await this.inspectionsService.getInspectionDataById(this.inspectionData.inspectionId, this.inspectionData.shipId);
            this.calculateFinalState();

            if(!this.inspection.inspection.showSummary){
                this.loadPDFData();
            }
        } catch (error) {
            console.error('loadSections', error);
        }
    }

    calculateFinalState(): void {
        const finalStatesArray = ['T', 'C'];
        this.finalState = finalStatesArray.includes(this.inspection.inspection.state);
    }

    async loadSurvey(section): Promise<void> {
        section.panelOpenState = true;
        section.loadingSurvey = true;
        try {
            const data = await this.inspectionsService.getSectionDataById(section.id, section.shipId, this.inspectionData.inspectionId);
            section.name = `section_${section.id}`;
            section.survey = JSON.parse(data.survey);

            if (data.answer !== undefined && data.answer !== null)
            {
                section.answers = JSON.parse(data.answer.answer);
                section.mode = data.answer.mode;
            }
        } catch (error) {
            console.error('section', section);
        }
        section.loadingSurvey = false;
    }

    async completeData(data, currentInspection): Promise<void> {
        const sectionAnswer = {
            SectionId: currentInspection.id,
            InspectionId: currentInspection.inspectionId,
            Answer: JSON.stringify(data)
        };
        this.inspection.pendingSections = await this.inspectionsService.SaveAnswers(sectionAnswer);

        currentInspection.pending = false;
        currentInspection.panelOpenState = false;

        const config = { data: { title: 'Información', message: 'Datos guardados exitosamente', buttonText: 'Aceptar', type: 'success' } };
        this.dialog.open(FuseMessageDialogComponent, config);
    }

    openDialog(option): void {

        const data = { inspection: this.inspection, finalState: this.finalState, downloadPDF: false };
        switch (option) {
            case 'conclusions':
                data['showConclusions'] = true;
                data['title'] = 'Conclusiones';
                break;
            case 'deficiencies':
                data['showDeficiencies'] = true;
                data['title'] = 'Deficiencias';
                break;
            case 'attachments':
                data['showAttachments'] = true;
                data['title'] = 'Anexo fotográfico';
                break;
            case 'breaches':
                data['showBreaches'] = true;
                data['title'] = 'Adicionar items incumplidos';
                break;
            case 'all':
                data['showConclusions'] = true;
                data['showDeficiencies'] = true;
                data['showAttachments'] = true;
                data['showBreaches'] = true;
                data['showSubtitle'] = true;
                data['downloadPDF'] = true;
                data['title'] = this.finalState ? 'Resumen de inspección' : 'Finalizar inspección';
                data['saveBtnText'] = 'Finalizar';                
                break;
        
            default:
                break;
        }

        if(option === 'all') {
            if(this.inspection.inspection.showSummary) {
                this.router.navigateByUrl(`${routesData.inspections.root}/${routesData.inspections.close}`, 
                    { state: { data } }
                );
            } else {
                const config = { 
                    data: { 
                        title: 'Finalizar', 
                        message: 'Está seguro que quiere finalizar la inspección?',
                        type: 'warning',
                        buttonText: 'Finalizar',
                        buttonCancelText: 'Cerrar'
                    } 
                };

                const dialogRef = this.dialog.open(FuseMessageDialogComponent, config);
                dialogRef.afterClosed().subscribe(async result => {
                    if (result) {
                        let savedAll: any = {};
                        try {
                            this.closingInspection = true;
                            this.errorMsg = null;
                            const data = {
                                inspectionId: this.inspection.inspection.inspectionId,
                                shipId: this.inspection.inspection.shipId,
                                description: this.inspection.inspection.conclusions,
                                conclusions: this.inspection.inspection.conclusions
                            };
                            await this.inspectionsService.endInspection(data);
                            this.inspection.inspection.state = 'T';
                            this.inspection.finalState = true; 
                            this.closingInspection = false;
                            savedAll = await this.inspectionsService.generateInspectionPDF(this.surveyComponent, this.inspection.inspection);
                        } catch (error) {
                            savedAll = error.message;
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
                });
            }
        } else {
            const dialogRef = this.dialog.open(ModalInspectionGenericComponent, {
                width: '80%',
                maxWidth: '900px',
                data 
            });
    
            dialogRef.afterClosed().subscribe(result => {
                this.inspection = result.inspection;
                this.calculateFinalState();          
            });
        }         
    }

    async loadFileInput(event): Promise<void> {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = async () => {

            this.uploadingFile = true;
            const data = {
                shipId: this.inspection.inspection.shipId,
                registrationNumber: this.inspection.ship.registrationNumber,
                photo: reader.result
            };

            let config = { data: { title: 'Información', message: 'Fotografía guardada con exito', buttonText: 'Aceptar', type: 'success' } };
            try {
                await this.inspectionsService.saveShipPhoto(data);
            } catch (error) {
                config.data.message = 'Error guardando el archivo';
                config.data.type = 'error';
            }
            
            this.dialog.open(FuseMessageDialogComponent, config);
            this.uploadingFile = false;
          };
        }
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
}
