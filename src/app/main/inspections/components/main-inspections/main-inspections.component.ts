import { Component } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseNavigationItem } from '@fuse/types';
import { NavigationService } from 'app/services/navigation/navigation.service';

import { locale as spanish } from './i18n/es';
import { routesData } from '../../../../routes';

@Component({
    selector: 'app-main-inspections',
    templateUrl: './main-inspections.component.html',
    styleUrls: ['./main-inspections.component.scss'],
})
export class MainInspectionsComponent {
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
                item.goToUrl === `/${routesData.inspections.root}`
        );
        this.items = parentItem.children || [];

        this.loadTitle();
    }

    async loadTitle(): Promise<void> {
        this.title = await this._fuseTranslationLoaderService.getTranslation(
            'MAIN_INSPECTIONS.TITLE'
        );
    }
}
