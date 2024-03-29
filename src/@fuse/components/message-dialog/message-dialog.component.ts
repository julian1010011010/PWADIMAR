import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector   : 'fuse-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls  : ['./message-dialog.component.scss']
})
export class FuseMessageDialogComponent
{

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseMessageDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseMessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
    }
}
