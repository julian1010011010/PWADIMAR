import { CommonModule } from '@angular/common';
import { NgModule  } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SurveyComponent } from './survey.component';

@NgModule({
    declarations: [
        SurveyComponent
    ],
    imports: [
        CommonModule,
        // Material
        MatProgressSpinnerModule
    ],
    providers: [],
    exports     : [
        SurveyComponent
    ]
})
export class SurveyModule
{
}
