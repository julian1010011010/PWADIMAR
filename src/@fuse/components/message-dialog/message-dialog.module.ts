import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        FuseMessageDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ]
})
export class FuseMessageDialogModule
{
}
