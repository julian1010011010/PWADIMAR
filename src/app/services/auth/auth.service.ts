import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

// services
import { ApiService } from '../api.service';
import { NavigationService } from '../navigation/navigation.service';

@Injectable()
export class AuthService {
    authData: { username: string, roles: any[], rights: any[], canEdit: boolean } = { username: null, roles: [], rights: [], canEdit: false };
    systemRoles: any = { 
        ADMIN: 'Admin', 
        FILES_SUPERVISOR: 'FilesSupervisor', 
        FILES_VIEWER: 'FilesViewer', 
        INSPECTORS_SUPERVISOR: 'InspectorsSupervisor', 
        INSPECTOR: 'Inspector' 
    };    
    private jwtHelper: JwtHelperService = new JwtHelperService();
    
    constructor(
        private apiService: ApiService,
        private navigationService: NavigationService,
        private router: Router,
        private _http: HttpClient) {
        // load data from storage for authenticated user, pending to decide correct behaviour
        if (localStorage.getItem('authData')) {
            this.authData = JSON.parse(localStorage.getItem('authData'));
            setTimeout(() => {
                this.navigationService.loadNavigation(this.authData.roles);
                this.router.navigate(['/inicio']);
            }, 100);            
        }
    }

    isTokenExpired(): boolean {
        const token = localStorage.getItem('token');
        let isExpired = true;

        if (token) {
            isExpired = this.jwtHelper.isTokenExpired(token);

            if (isExpired) {
                this.router.navigate(['auth/login']);
            }
        } else {
            this.router.navigate(['auth/login']);
        }

        return isExpired;
    }

    doLogin = (username: string, password: string): Promise<any> => {
        return this._http.post(`${this.apiService.apiUrl}/Account/login`, {username, password, accesstype: "Web"})
            .pipe(map((response: Response) => response)).toPromise();
    }

    doLogout(): void {
        this.authData = { username: null, roles: [], rights: [], canEdit: false };
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    doRedirect(): void{
        window.open('http://codaltec.bitpointer.co/help/')
    }
}
