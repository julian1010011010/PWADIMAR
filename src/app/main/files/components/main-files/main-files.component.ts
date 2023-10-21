import { Component } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NavigationService } from 'app/services/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/types/fuse-navigation';

import { locale as spanish } from './i18n/es';
import { routesData } from '../../../../routes';

@Component({
    selector: 'app-main-files',
    templateUrl: './main-files.component.html',
    styleUrls: ['./main-files.component.scss'],
})
export class MainFilesComponent {
    title: string;
    items: FuseNavigationItem[] = [];
    imageUrlArray: string[] = [ 'inspecciones_1.jpg', 'inspecciones_2.jpg', 'inspecciones_3.jpg', 'inspecciones_4.jpg' ];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public navigationService: NavigationService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(spanish);

        const parentItem = navigationService.navigation.find(
            (item: FuseNavigationItem) =>
                item.goToUrl === `/${routesData.files.root}`
        );
        this.items = parentItem.children || [];

        this.loadTitle();
    }

    async loadTitle(): Promise<void> {
        this.title = await this._fuseTranslationLoaderService.getTranslation(
            'MAIN_FILES.TITLE'
        );
    }
}
