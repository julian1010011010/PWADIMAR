import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material/dialog';

import { locale as spanish } from './i18n/es';

// services
import { AuthService } from 'app/services/auth/auth.service';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { NavigationService } from 'app/services/navigation/navigation.service';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{  hide = true;
    loginForm: FormGroup;
    loading = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private authService: AuthService,
        private navigationService: NavigationService,
        private dialog: MatDialog, 
        private router: Router
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: false
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        // Load translations
        this._fuseTranslationLoaderService.loadTranslations(spanish);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            username   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    /**
     * Do login
     */
    async doLogin(): Promise<void> {
        this.loading = true;
        try {            
            const loginResponse = await this.authService.doLogin(this.loginForm.get('username').value, this.loginForm.get('password').value);
    
            if (loginResponse.accessToken) {
                this.authService.authData = { username: loginResponse.username, roles: loginResponse.roles, rights: loginResponse.rights, canEdit: false};
                
                localStorage.setItem('authData', JSON.stringify(this.authService.authData));
                localStorage.setItem('refreshToken', loginResponse.refreshToken);
                localStorage.setItem('token', loginResponse.accessToken);
                
                this.navigationService.loadNavigation(this.authService.authData.roles);

                this.router.navigate(['/inicio']);
            }
        } catch (error) {
            const config = { data: { title: 'Error', message: error.error.Message, buttonText: 'Aceptar', type: 'error'} };
            this.dialog.open(FuseMessageDialogComponent, config);
            console.error('login.component', error);
        }    
        this.loading = false;    
    }
}
