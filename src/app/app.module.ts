import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AppRoutingModule } from './app-routing.module';

// services
import { AuthGuardService } from './services/auth/authGuard.service';
import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api.service';
import { RequestInterceptorService } from './services/interceptor/requestInterceptor.service';
import { FuseMessageDialogModule } from '@fuse/components/message-dialog/message-dialog.module';
import { NavigationService } from './services/navigation/navigation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { CommonModule } from '@angular/common';

import { ToastrModule } from 'ngx-toastr';
@NgModule({
    declarations: [
        AppComponent,

    ],
    imports     : [
        CommonModule, 
        ToastrModule.forRoot(), // ToastrModule added
        MatProgressSpinnerModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseMessageDialogModule,

        // App routing
        AppRoutingModule,
        
        // App modules
        LayoutModule
    ],
    providers: [
        ApiService,
        AuthGuardService,
        AuthService,
        NavigationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent], 
 
})
export class AppModule
{
}
