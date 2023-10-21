import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Translations
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '../../../../../@fuse/services/translation-loader.service';
import { ConclusionsComponent } from '../conclusions/conclusions.component';
import { SurveyComponent } from 'app/main/app-common/survey/survey.component';
import { InspectionsService } from 'app/services/inspections/inspections.service';

@Component({
  selector: 'app-modal-inspection-generic',
  templateUrl: './modal-inspection-generic.component.html',
  styleUrls: ['./modal-inspection-generic.component.scss'],
})
export class ModalInspectionGenericComponent implements OnInit {

  @ViewChild(SurveyComponent) surveyComponent;
  @ViewChild(ConclusionsComponent) conclusionsComp: ConclusionsComponent;

  title: string;
  savingData = false;
  errorMsg: string;
  successSave = false;
  saveBtnText = 'Guardar';
  showSave = false;
  isSaveActive = false;
  inspection: any;
  finalState = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalInspectionGenericComponent>,
    private inspectionsService: InspectionsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);

    this.inspection = this.data.inspection;
    this.finalState = this.data.finalState;
  }

  ngOnInit(): void {
    if (this.data.saveBtnText) {
      this.saveBtnText = this.data.saveBtnText;
    }
  }

  save(): void {
    if (this.data.showConclusions) {
      this.conclusionsComp.saveConclusions();
    }
  }

  closeDialog(): void {
    this.data.inspection = this.inspection;
    this.dialogRef.close(this.data);
  }
}
