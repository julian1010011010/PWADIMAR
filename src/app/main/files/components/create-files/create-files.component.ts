import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as spanish } from '../consult-files/i18n/es';
@Component({
  selector: 'app-create-files',
  templateUrl: './create-files.component.html',
  styleUrls: ['./create-files.component.scss']
})
export class CreateFilesComponent implements OnInit {

  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService) { }

  ngOnInit(): void {
    this._fuseTranslationLoaderService.loadTranslations(spanish);
  }

}
