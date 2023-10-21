import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { InspectionsService } from 'app/services/inspections/inspections.service';

@Component({
    selector: 'app-conclusions',
    templateUrl: './conclusions.component.html',
    styleUrls: ['./conclusions.component.scss'],
})
export class ConclusionsComponent implements OnInit {
    @Input() inspection: any;
    @Output() inspectionChange = new EventEmitter<any>();

    @Input() successSave: boolean;
    @Output() successSaveChange = new EventEmitter<boolean>();

    @Input() errorMsg: string;
    @Output() errorMsgChange = new EventEmitter<string>();

    @Input() savingData: boolean;
    @Output() savingDataChange = new EventEmitter<boolean>();

    @Input() showSave: boolean;
    @Output() showSaveChange = new EventEmitter<boolean>();

    @Input() isSaveActive: boolean;
    @Output() isSaveActiveChange = new EventEmitter<boolean>();

    @Input() finalState: boolean;
    @Output() finalStateChange = new EventEmitter<boolean>();
    
    @Input() showSubtitle: boolean;

    @Output() savedProcess = new EventEmitter<any>();
    
    maxNumberOfCharacters = 1500;
    counter = true;
    numberOfCharacters2 = 0;

    constructor(
      private inspectionsService: InspectionsService,
      public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
          this.showSaveChange.emit(true);
          const conclusions = this.inspection.inspection.conclusions;
          if (conclusions && conclusions.length > 0) {
            this.isSaveActiveChange.emit(true);
            this.onModelChange(conclusions);
          }
        }, 300);
    }

    async saveConclusions(): Promise<void> {
        this.savingDataChange.emit(true);
        this.successSaveChange.emit(false);
        try {
          const data = {
            inspectionId: this.inspection.inspection.inspectionId,
            shipId: this.inspection.inspection.shipId,
            description: this.inspection.inspection.conclusions,
            conclusions: this.inspection.inspection.conclusions
          };
          
          // If showSubtitle it's because we are showing the end modal
          if (this.showSubtitle) {
            const config = { 
              data: { 
                title: 'Finalizar', 
                message: 'Está seguro que quiere finalizar la inspección?',
                type: 'warning',
                buttonText: 'Finalizar',
                buttonCancelText: 'Cerrar'
              } 
            };
            const dialogRef = this.dialog.open(FuseMessageDialogComponent, config);
            dialogRef.afterClosed().subscribe(async result => {
              if (result) {
                await this.inspectionsService.endInspection(data);
                this.inspection.inspection.state = 'T';
                this.inspection.finalState = true;
                this.finalStateChange.emit(true);
                this.showSaveChange.emit(false);
                this.successSaveChange.emit(true);
                this.inspectionChange.emit(this.inspection);
                this.savedProcess.emit(true);                
              }       
            });            
          } else {
            await this.inspectionsService.saveInspectionConclusion(data);
            this.successSaveChange.emit(true);
            this.inspectionChange.emit(this.inspection);
          }
        } catch (error) {
            this.errorMsgChange.emit(error.message);
        }
        this.savingDataChange.emit(false);
    }

    onModelChange(textValue: string): void {
        this.numberOfCharacters2 = textValue.length;

        if (textValue.length > 0) {
            this.isSaveActiveChange.emit(true);
        } else {
            this.isSaveActiveChange.emit(false);
        }
    }
}
