import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '../../../../@fuse/shared.module';
import { AppCommonService } from '../../../../app/services/app-common/app-common.service';
import { ReportsComponent } from './reports.component';
import {DataTablesModule} from 'angular-datatables';
import { SurveyModule } from '../survey/survey.module';
import { MatSelectModule } from '@angular/material/select';
//import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        CommonModule,
        SurveyModule,
        FuseSharedModule,
        MatSelectModule,
        DataTablesModule,
        MatButtonModule,
        ChartModule  //HighchartsChartModule
    ],
    providers: [
        AppCommonService
    ],
    exports: [
        ReportsComponent
    ]
})
export class ReportsModule
{
}
