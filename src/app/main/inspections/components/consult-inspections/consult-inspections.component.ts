import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InspectionsService } from '../../../../services/inspections/inspections.service';
import { InspectionDetailComponent } from '../inspection-detail/inspection-detail.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as spanish } from './i18n/es';
import { AppCommonService } from 'app/services/app-common/app-common.service';
import { AuthService } from 'app/services/auth/auth.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
registerLocaleData(localeFr);

export interface Inspection {
    value: string;
    viewValue: string;
}
@Component({
    selector: 'app-consult-inspections',
    templateUrl: './consult-inspections.component.html',
    styleUrls: ['./consult-inspections.component.scss'],
    providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class ConsultInspectionsComponent implements OnInit {
    formSelect: FormGroup;
    // Key to use on generic service
    selectStateKey = 'EstadosInspeccion';
    selectedState: string;
    inspectionStates = [];
    isHidden = true;
    isLoading = false;
    public count = 100;
    public pageSize = 3;
    public limit = 10;
    public offset = 0;
    rows: any[];
    date_from: any;
    date_to: any;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        public dialog: MatDialog,
        public authService: AuthService,
        private inspectionsService: InspectionsService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appCommonService: AppCommonService,
        private datePipe: DatePipe) 
    {
        this._fuseTranslationLoaderService.loadTranslations(spanish);
        var d = new Date();
        this.date_to = this.datePipe.transform(d, 'yyyy-MM-dd');
        d.setMonth(d.getMonth() - 1);
        this.date_from = this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    ngOnInit(): void {
        this.loadInspectionStates();
    }

    async loadInspectionStates(): Promise<void> {
        try {
            this.inspectionStates = await this.appCommonService.GetDataGenericByName(this.selectStateKey).toPromise();    
        } catch (error) {
               
        }
    }

    openDialog(row, rowIndex, value): void {
        const dialogRef = this.dialog.open(InspectionDetailComponent, {
            width: 'auto',
            data: { inspection: row }
        });
    }

    clearResults(): void {
        this.isHidden = true;
        this.rows = [];
    }

    async searchInspection(): Promise<void> {
        
        if(this.selectedState === undefined || this.selectedState === null)
        {
            const config = { data: { title: 'Mensaje del sistema', message: 'El estado de la inspección es requerido', buttonText: 'Cerrar', type: 'warning' } };
            this.dialog.open(FuseMessageDialogComponent, config);
        }
        else 
        {        
            if(this.date_from === undefined || this.date_from === null)
            {
                const config = { data: { title: 'Mensaje del sistema', message: 'La Fecha Desde es requerida', buttonText: 'Cerrar', type: 'warning' } };
                this.dialog.open(FuseMessageDialogComponent, config);
            }
            else 
            {        
                if(this.date_to === undefined || this.date_to === null)
                {
                    const config = { data: { title: 'Mensaje del sistema', message: 'La Fecha Hasta es requerida', buttonText: 'Cerrar', type: 'warning' } };
                    this.dialog.open(FuseMessageDialogComponent, config);
                }
                else
                {
                    this.isLoading = true;
                    try {
                        this.rows = await this.inspectionsService.getInspectionsByState(this.selectedState, this.date_from, this.date_to);    
                        this.isHidden = false;
                    } catch (error) {}        
                    this.isLoading = false;
                }
            }
        }
    }

    searchNewInspection(): void {
        this.isHidden = true;
    }

    showInspectorColumn(): boolean {
        const roles = [this.authService.systemRoles.INSPECTORS_SUPERVISOR, this.authService.systemRoles.ADMIN];
        let showColumn = false;
        roles.forEach(role => {
            if (!showColumn) {
                showColumn = this.authService.authData.roles.includes(role);
            }
        });
        return showColumn;
    }
}
