import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InspectionsService } from 'app/services/inspections/inspections.service';

@Component({
    selector: 'app-deficiencies',
    templateUrl: './deficiencies.component.html',
    styleUrls: ['./deficiencies.component.scss'],
})
export class DeficienciesComponent implements OnInit {

  @Input() inspection: any;
  @Output() inspectionChange = new EventEmitter<any>();

  @Input() errorMsg: string;
  @Output() errorMsgChange = new EventEmitter<string>();

  @Input() showSubtitle: boolean;
  @Input() finalState: boolean;
  isLoading = false;
  deficiencyDescription: string;

  constructor(
      private inspectionsService: InspectionsService
  ) {}

  ngOnInit(): void {}

  async add(): Promise<void> {
    this.isLoading = true;
    await this.saveDeficiency({ description: this.deficiencyDescription }, 'I');
    this.isLoading = false;
  }

  async saveDeficiency(deficiency, actionType): Promise<void> {
    deficiency.isSaving = true;
    const data = { 
      inspectionId: this.inspection.inspection.inspectionId,
      description: deficiency.description,
      id: deficiency.id,
      actionType 
    };
    
    try {
      const newDeficiency = await this.inspectionsService.saveInspectionDeficiency(data);
      
      switch (actionType) {
        case 'I':
          this.inspection.deficiencies.push(newDeficiency);
          break;
        case 'D':
          this.inspection.deficiencies = this.inspection.deficiencies.filter(item => item.id !== deficiency.id);
          break;
      
        default:
          break;
      }
      this.inspectionChange.emit(this.inspection);
    } catch (error) {
      this.errorMsgChange.emit(error.message);
    }    
    deficiency.isSaving = false;
    this.deficiencyDescription = '';
  }
}
