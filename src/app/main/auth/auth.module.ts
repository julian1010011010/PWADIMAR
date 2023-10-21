import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { LoginComponent } from "./components/login/login.component";
import { ReportLoginsComponent } from "./components/report-logins/report-logins.component";
import { ReportsModule } from "../app-common/reports/reports.module";
import { AuthGuardService } from "app/services/auth/authGuard.service";
import { routesData } from "../../routes";
import { InspectionFormComponent } from "./components/inspection-form/inspection-form.component";
import { MatCardModule } from "@angular/material/card";

const routes = [
    {
        path: routesData.admin.login,
        component: LoginComponent,
    },
    {
        path: routesData.admin.sessions,
        component: ReportLoginsComponent,
        canActivate: [AuthGuardService],
        data: {
            roles: ["Admin"],
            module: "sessions_report",
        },
    },
    {
        path: routesData.admin.inspection,
        component: InspectionFormComponent,
        data: {
            roles: ["Admin"],
            module: "inspection_form",
        },
    },
];

@NgModule({
    declarations: [
        LoginComponent,
        ReportLoginsComponent,
        InspectionFormComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseSharedModule,
        ReportsModule,
        NgxDatatableModule,
        MatCardModule,
    ],
})
export class AuthModule {}
