import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '../../../@fuse/shared.module';

import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from 'app/services/auth/authGuard.service';
import { OptionCardsModule } from '../app-common/option-cards/option-cards.module';

const routes = [
    {
        path     : '',
        component: HomeComponent,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        OptionCardsModule
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
