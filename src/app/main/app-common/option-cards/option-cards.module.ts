import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OptionCardsComponent } from './option-cards.component';
// resize 
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
    declarations: [
        OptionCardsComponent
    ],
    imports     : [
        FuseSharedModule,
        MatCardModule,
        MatIconModule,
        IvyCarouselModule,
        AngularResizedEventModule
    ],
    exports     : [
        OptionCardsComponent
    ]
})

export class OptionCardsModule
{
}
