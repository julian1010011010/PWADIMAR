 
import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainFilesComponent } from '../files/components/main-files/main-files.component';
import { ReportsFilesComponent } from './components/reports-files/reports-files.component';
import { ConsultFilesComponent } from './components/consult-files/consult-files.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuthGuardService } from 'app/services/auth/authGuard.service';
import { OptionCardsModule } from '../app-common/option-cards/option-cards.module';
import { routesData } from '../../routes';
import { ReportsModule } from '../app-common/reports/reports.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FileDetailComponent } from './components/file-detail/file-detail.component';
import { UploadedFilesComponent } from './components/file-detail/uploaded-files/uploaded-files.component';
import { LoadFilesComponent } from './components/file-detail/load-files/load-files.component';
import { ModalAddFileComponent } from './components/file-detail/modal-add-file/modal-add-file.component';
import { ModalFileUploadComponent } from './components/file-detail/modal-file-upload/modal-file-upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeeDocumentDetailComponent } from './components/file-detail/see-document-detail/see-document-detail.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ModalConfirmationComponent } from './components/file-detail/modal-confirmation/modal-confirmation.component';
import { CreateFilesComponent } from './components/create-files/create-files.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DetailPrintComponent } from './components/file-detail/detail-print/detail-print.component';
import { MatRadioModule } from '@angular/material/radio';
import { QueryFilesComponent } from './components/file-detail/query-files/query-files.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OnlySeeDocumentDetailComponent } from './components/only-see-document-detail/only-see-document-detail.component';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';

const routes = [
    {
        path: '',
        component: MainFilesComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer']
        }
    },
 
    {
        path: routesData.files.reports,
        component: ReportsFilesComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files_report'
        }
    },
    {
        path: routesData.files.query,
        component: ConsultFilesComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files'
        }
    },
    {
        path: routesData.files.detail + '/:id',
        component: FileDetailComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files'
        }
    },
    {
        path: routesData.files.detailFile,
        component: SeeDocumentDetailComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files'
        }
    },
    {
        path: routesData.files.onlyDetail,
        component: OnlySeeDocumentDetailComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files'
        }
    },
    {
        path: routesData.files.create,
        component: CreateFilesComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ['Admin', 'FilesSupervisor', 'FilesViewer'],
            module: 'files'
        }
    },
];

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === "input") {
            return formatDate(date, 'dd/MM/yyyy', this.locale);
        } else {
            return date.toDateString();
        }
    }
}

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};

@NgModule({
    declarations: [
        OnlySeeDocumentDetailComponent,
        QueryFilesComponent,
        ModalFileUploadComponent,
        LoadFilesComponent,
        MainFilesComponent,
        ReportsFilesComponent,
        ConsultFilesComponent,
        FileDetailComponent,
        UploadedFilesComponent,
        ModalAddFileComponent,
        SeeDocumentDetailComponent,
        ModalConfirmationComponent,
        CreateFilesComponent,
        DetailPrintComponent,
        ErrorDialogComponent,
    ],
    imports: [ 
        MatNativeDateModule,
        MatDatepickerModule,
        MatCardModule,
        CommonModule,
        FuseSharedModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        NgxExtendedPdfViewerModule,
        OptionCardsModule,
        ReportsModule,
        // Material
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTabsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatRadioModule
    ],
    exports: [
        MainFilesComponent, 
        ConsultFilesComponent
    ],
    providers: [DatePipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class FilesModule { }
