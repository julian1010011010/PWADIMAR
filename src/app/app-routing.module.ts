import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth/authGuard.service';
import { routesData } from './routes';

const appRoutes: Routes = [
    {
        path: routesData.admin.root,
        loadChildren: () => import('app/main/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: routesData.home.root,
        loadChildren: () => import('app/main/home/home.module').then(m => m.HomeModule)
    },
    {
        path: routesData.files.root,
        loadChildren: () => import('app/main/files/files.module').then(m => m.FilesModule)
    },
    {
        path: routesData.inspections.root,
        loadChildren: () => import('app/main/inspections/inspections.module').then(m => m.InspectionsModule)
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
