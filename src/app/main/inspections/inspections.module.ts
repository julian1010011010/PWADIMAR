import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '../../../@fuse/shared.module';
import { ReportsModule } from '../app-common/reports/reports.module';
import { MainInspectionsComponent} from '../inspections/components/main-inspections/main-inspections.component';
import { ConsultInspectionsComponent } from './components/consult-inspections/consult-inspections.component';
import { ReportsInspectionsComponent } from './components/reports-inspections/reports-inspections.component';
import { StandardformComponent } from './components/consult-inspections/standardform/standardform.component';
import { InspectionDetailComponent } from './components/inspection-detail/inspection-detail.component';
import { InspectionFormatsComponent } from './components/inspection-formats/inspection-formats.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuthGuardService } from 'app/services/auth/authGuard.service';
import { OptionCardsModule } from '../app-common/option-cards/option-cards.module';
import { BreachesComponent } from './components/breaches/breaches.component';
import { ConclusionsComponent } from './components/conclusions/conclusions.component';
import { DeficienciesComponent } from './components/deficiencies/deficiencies.component';
import { PhotographicAnnexComponent } from './components/photographic-annex/photographic-annex.component';
import { routesData } from 'app/routes';
import { SurveyModule } from '../app-common/survey/survey.module';
import { CloseInspectionComponent } from './components/close-inspection/close-inspection.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalInspectionGenericComponent } from './components/modal-inspection-generic/modal-inspection-generic.component';
import { CertificatesComponent } from './components/certificates/certificates.component';


const routes = [
  {
      path     : '',
      component: MainInspectionsComponent,
      canActivate: [AuthGuardService],
      data       : {
          roles: [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
          module: 'inspections'
      }
  },
  {
      path     : routesData.inspections.query,
      component:  ConsultInspectionsComponent,
      canActivate: [AuthGuardService],
      data       : {
          roles: [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
          module: 'inspections'
      }
  },
  {
      path     : routesData.inspections.reports,
      component: ReportsInspectionsComponent,
      canActivate: [AuthGuardService],
      data       : {
          roles: [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
          module: 'inspections_report'
      }
  },
  {
      path     : routesData.inspections.formats,
      component: InspectionFormatsComponent,
      canActivate: [AuthGuardService],
      data       : {
          roles: [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
          module: 'inspections'
      }
  },
  {
      path     : routesData.inspections.close,
      component: CloseInspectionComponent,
      canActivate: [AuthGuardService],
      data       : {
          roles: [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
          module: 'inspections'
      }
  }
];
@NgModule({
  declarations: [
    ConsultInspectionsComponent, 
    ReportsInspectionsComponent, 
    MainInspectionsComponent,
    ConsultInspectionsComponent,
    StandardformComponent,
    InspectionDetailComponent,
    DeficienciesComponent,
    ConclusionsComponent,
    PhotographicAnnexComponent,
    BreachesComponent,
    InspectionFormatsComponent,
    ModalInspectionGenericComponent,
    CloseInspectionComponent,
    CertificatesComponent
  ],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    ReportsModule,
    MatExpansionModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    NgxDatatableModule,
    OptionCardsModule,
    SurveyModule,
    TranslateModule
  ],
  exports     : [
    MainInspectionsComponent,
    MatButtonModule,
    ConsultInspectionsComponent,
    InspectionDetailComponent,
    DeficienciesComponent,
    ConclusionsComponent,
    PhotographicAnnexComponent,
    BreachesComponent,
    InspectionFormatsComponent,
    CloseInspectionComponent
  ],
  providers: [ DatePipe ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InspectionsModule { }
