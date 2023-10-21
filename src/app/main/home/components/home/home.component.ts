import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NavigationService } from 'app/services/navigation/navigation.service';

import { locale as spanish } from './i18n/es';

@Component({
    selector   : 'home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent
{
    title: string;
    imageUrlArray: string[] = [ 'home_1.png', 'home_2.png', 'home_3.png', 'home_4.png', 'home_5.png' ];

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public navigationService: NavigationService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(spanish);

        this.loadTitle();
    }

    async loadTitle(): Promise<void> {
        this.title = await this._fuseTranslationLoaderService.getTranslation('HOME.TITLE');
    }
}
