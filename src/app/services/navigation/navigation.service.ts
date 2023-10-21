import { Injectable } from '@angular/core';
import { FuseNavigationService } from '../../../@fuse/components/navigation/navigation.service';
import { navigation } from '../../navigation/navigation';
import { clone } from 'lodash';

@Injectable()
export class NavigationService {

    navigation: any;
        
    constructor(
        private _fuseNavigationService: FuseNavigationService
    ) {}

    /**
     * Load navigation for the current role
     * @param roles 
     */
    loadNavigation(roles): void {

        if (this._fuseNavigationService.getCurrentNavigation()) {
            this._fuseNavigationService.unregister('main');
        }
        
        const userNavigation = [];

        navigation.forEach(parent => {
            const tempParent = clone(parent);
            tempParent.children = [];
            roles.forEach(role => {
                if (this.checkRole(parent, role)) {
                    // check if parent has children
                    if (parent.children && parent.children.length > 0){
                        parent.children.forEach(child => {
                            if (this.checkRole(child, role)) {
                                if (!tempParent.children.find(item => item.id === child.id)) {
                                    tempParent.children.push(child);
                                }                                
                            }
                        });
                    }
                    if (!userNavigation.find(item => item.id === tempParent.id)) {
                        userNavigation.push(tempParent);
                    }                    
                }
            });            
        });

        // Get default navigation
        this.navigation = userNavigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');
    }

    checkRole(item, role): boolean {
        return !item.roles || item.roles.length === 0 || item.roles.includes(role);
    }
}
