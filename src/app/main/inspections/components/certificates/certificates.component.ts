import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InspectionsService } from 'app/services/inspections/inspections.service';

// Translations
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppCommonService } from 'app/services/app-common/app-common.service';

// id of the certificate
const definitiveCertificate = 2;

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.scss'],
})
export class CertificatesComponent implements OnInit {

  @Input() inspection: any;
  @Output() inspectionChange = new EventEmitter<any>();

  @Input() errorMsg: string;
  @Output() errorMsgChange = new EventEmitter<string>();

  @Input() finalState: boolean;

  isLoading = false;
  selectedType: string;
  selectedGenerationType: string;
  certificateTypes: any = [];
  generationTypes: any = [];
  // Key to use on generic service
  selectTypeKey = 'TiposCertificadoInspeccion';
  selectGenerationTypeKey = 'TiposGeneracion';
  loadingTypesError = false;
  loadingGenerationError = false;
  
  constructor(
      private inspectionsService: InspectionsService,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private appCommonService: AppCommonService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

  ngOnInit(): void {
    this.loadCertificateTypes();
    this.loadGenerationTypes();
  }
  
  async loadCertificateTypes(): Promise<void> {
    try {
      this.loadingTypesError = false
      this.certificateTypes = [];
      this.selectedType = null;
      this.certificateTypes = await this.appCommonService.GetDataGenericByName(this.selectTypeKey, definitiveCertificate, null, this.inspection.inspection.shipId).toPromise();    
    } catch (error) {
      this.loadingTypesError = true;
    }
  }

  async loadGenerationTypes(): Promise<void> {
    try {
      this.loadingGenerationError = false;
      this.generationTypes = [];
      this.selectedGenerationType = null;
      this.generationTypes = await this.appCommonService.GetDataGenericByName(this.selectGenerationTypeKey, definitiveCertificate, null, this.inspection.inspection.shipId).toPromise();    
    } catch (error) {
      this.loadingGenerationError = true;
    }
  }

  async add(): Promise<void> {
    this.isLoading = true;
    await this.saveCertificates({ 
      additionalId: this.selectedType,
      additionalId2: this.selectedGenerationType,
      inspectionId: this.inspection.inspection.inspectionId 
    }, 'I');
    this.isLoading = false;
  }

  async saveCertificates(certificates, actionType): Promise<void> {
    certificates.isSaving = true;
    const data = { 
      inspectionId: this.inspection.inspection.inspectionId,
      id: certificates.id,
      additionalId: certificates.additionalId,
      additionalId2: certificates.additionalId2,
      actionType 
    };
    
    try {
      const newCertificates = await this.inspectionsService.saveInspectionCertificate(data);
      
      switch (actionType) {
        case 'I':
          this.inspection.certificates.push(newCertificates);
          break;
        case 'D':
          this.inspection.certificates = this.inspection.certificates.filter(item => item.id !== certificates.id);
          break;
      
        default:
          break;
      }
      this.inspectionChange.emit(this.inspection);

    } catch (error) {
      this.errorMsgChange.emit(error.message);
    }    
    certificates.isSaving = false;
    this.selectedType = null;
    this.selectedGenerationType = null;
  }
}
