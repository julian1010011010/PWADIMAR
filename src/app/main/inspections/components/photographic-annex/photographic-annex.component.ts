import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InspectionsService } from 'app/services/inspections/inspections.service';

@Component({
    selector: 'app-photographic-annex',
    templateUrl: './photographic-annex.component.html',
    styleUrls: ['./photographic-annex.component.scss'],
})
export class PhotographicAnnexComponent implements OnInit {

  @Input() inspection: any;
  @Output() inspectionChange = new EventEmitter<any>();

  @Input() errorMsg: string;
  @Output() errorMsgChange = new EventEmitter<string>();

  @Input() showSubtitle: boolean;
  @Input() finalState: boolean;
  
  isLoading = false;
  attachmentDescription: string;
  fileToUpload: any;
  fileName: string;

  constructor(
      private inspectionsService: InspectionsService
  ) {}

  ngOnInit(): void {}

  async add(): Promise<void> {
    this.isLoading = true;
    await this.saveAttachment({ description: this.attachmentDescription }, 'I');
    this.isLoading = false;
  }

  async saveAttachment(attachment, actionType): Promise<void> {
    attachment.isSaving = true;
    /*const formData = new FormData();  
    formData.append('file', this.fileToUpload);
    formData.append('inspectionId', this.data.inspection.inspectionId);
    formData.append('description', attachment.description);
    formData.append('fileName', this.fileName);
    formData.append('id', attachment.id);
    formData.append('actionType', actionType);*/

    const data = { 
        inspectionId: this.inspection.inspection.inspectionId,
        description: attachment.description,
        id: attachment.id,
        fileName: this.fileName,
        file: this.fileToUpload,
        actionType 
    };
        
    try {
      const newAttachment = await this.inspectionsService.saveInspectionAttachment(data);
      
      switch (actionType) {
        case 'I':
          this.inspection.attachments.push(newAttachment);
          break;
        case 'D':
          this.inspection.attachments = this.inspection.attachments.filter(item => item.id !== attachment.id);
          break;
      
        default:
          break;
      }
      this.inspectionChange.emit(this.inspection);
    } catch (error) {
      this.errorMsgChange.emit(error.message);
    }    
    attachment.isSaving = false;
    this.attachmentDescription = '';
    this.fileName = '';
    this.fileToUpload = null;
  }

  loadFileInput(event): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName = file.name;
        this.fileToUpload = reader.result;
      };
    }
  }

  async loadAttachmentFile(attachment): Promise<void> {
    try {
        const attachmentObj = await this.inspectionsService.getAttachmentById(attachment.id, attachment.inspectionId);

        this.viewImage(attachmentObj.file);
    } catch (error) {
        
    }    
  }

  viewImage(imageBase64): void {
    const image = new Image();
    image.src = imageBase64;

    const w = window.open('');
    w.document.write(image.outerHTML);
  }
}
