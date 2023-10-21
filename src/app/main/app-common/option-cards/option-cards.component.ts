import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ResizedEvent } from 'angular-resize-event';
import { FuseNavigationItem } from '../../../../@fuse/types/fuse-navigation';

@Component({
    selector   : 'option-cards',
    templateUrl: './option-cards.component.html',
    styleUrls  : ['./option-cards.component.scss']
})
export class OptionCardsComponent implements OnInit
{
    @ViewChild('optionCards') optionCards: ElementRef;

    @Input()
    items: FuseNavigationItem[];

    @Input()
    title: string;

    @Input()
    imageUrlArray: any = [];

    cards: FuseNavigationItem[];
    showSlide = false;

    divWidth: number;

    // Private

    /**
     * Constructor
     */
    constructor(
        private router: Router
    ){}

    ngOnInit(): void {
        this.cards = this.items.filter(item => item.id !== 'home');

        if (this.imageUrlArray.length > 0) {
            this.imageUrlArray = this.imageUrlArray.map(element => {
                return { path: `assets/images/banners/${element}`};
            });
            this.showSlide = true;
        }
    }

    
    onResized(event: ResizedEvent) {
        if(this.divWidth !== event.newWidth){
            this.divWidth = event.newWidth;
            this.showSlide = false;
            setTimeout(()=>{
                this.showSlide = true;
            }, 50);
        }
    }

    goTo(item: FuseNavigationItem): void {
        const url = item.goToUrl || item.url;
        if (url) {
            this.router.navigate([url]);
        }
    }
}
