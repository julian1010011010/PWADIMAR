import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InspectionsService } from 'app/services/inspections/inspections.service';

// Translations
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppCommonService } from 'app/services/app-common/app-common.service';

@Component({
    selector: 'app-breaches',
    templateUrl: './breaches.component.html',
    styleUrls: ['./breaches.component.scss'],
})
export class BreachesComponent implements OnInit {

  @Input() inspection: any;
  @Output() inspectionChange = new EventEmitter<any>();

  @Input() errorMsg: string;
  @Output() errorMsgChange = new EventEmitter<string>();

  @Input() showSubtitle: boolean;
  @Input() finalState: boolean;
  isLoading = false;
  breachDescription: string;
  breachesOptions: any = [];
  selectedOption: any;
  correctionDate: any;
  // Key to use on generic service
  selectOptionKey = 'EstadosInspeccion';
  loadingOptionsError = false;

  constructor(
      private inspectionsService: InspectionsService,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private appCommonService: AppCommonService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

  ngOnInit(): void {
    // this.loadBreachesOptions();
  }
  /*
  async loadBreachesOptions(): Promise<void> {
    try {
      this.breachesOptions = await this.appCommonService.GetDataGenericByName(this.selectOptionKey).toPromise();    
    } catch (error) {
      this.loadingOptionsError = true;
    }
  }*/

  async add(): Promise<void> {
    this.isLoading = true;
    await this.saveBreach({ description: this.selectedOption, dueDate: this.correctionDate }, 'I');
    this.isLoading = false;
  }

  async saveBreach(breach, actionType): Promise<void> {
    breach.isSaving = true;
    const data = { 
      inspectionId: this.inspection.inspection.inspectionId,
      id: breach.id,
      description: breach.description,
      dueDate: breach.dueDate,
      actionType 
    };
    
    try {
      const newBreach = await this.inspectionsService.saveInspectionBreach(data);
      
      switch (actionType) {
        case 'I':
          this.inspection.breaches.push(newBreach);
          break;
        case 'D':
          this.inspection.breaches = this.inspection.breaches.filter(item => item.id !== breach.id);
          break;
      
        default:
          break;
      }
      this.inspectionChange.emit(this.inspection);

    } catch (error) {
      this.errorMsgChange.emit(error.message);
    }    
    breach.isSaving = false;
    this.breachDescription = '';
  }
}
