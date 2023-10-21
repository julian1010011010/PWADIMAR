import { locale as spanish } from "./i18n/es";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

@Component({
    selector: "app-inspection-form",
    templateUrl: "./inspection-form.component.html",
    styleUrls: ["./inspection-form.component.scss"],
})
export class InspectionFormComponent {
    inspectionForm: FormGroup;
    seetable = false;
    verMensaje = false;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this._fuseTranslationLoaderService.loadTranslations(spanish);
        this.inspectionForm = this.fb.group({
            nameForm: [[]],
            shipSubcategory: [[]],
            date: [[]],
            state: [[]],
            management: [[]],
        });
    }

    showtable() {
        this.seetable = !this.seetable;
    };
}
