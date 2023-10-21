import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let canAccess = !this.authService.isTokenExpired();

        const userRoles = this.authService.authData.roles;
        userRoles.forEach(role => {
            // check if route is restricted by role
            if (route.data.roles && !route.data.roles.includes(role)) {
                canAccess = false;
            } else {
                canAccess = true;
            }
        });

        // role not authorised so redirect to home page
        if (!canAccess){
            this.router.navigate(['/inicio']);
        }
        
        return canAccess;
    }
}
