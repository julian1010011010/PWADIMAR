import { Component, OnInit,ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

export interface PeriodicElement {
  item: string;
  requisito: string;
  descripcion: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {item: 'Visivilidad en el puente de navegación.',
   requisito: 'No ofrece una vista de la superficie del mar',
   descripcion: 'xxxxxxxxxxxxx'},
   {item:'prueba de formulario',
    requisito:'no funcionaba el responsive',
   descripcion:'xxxxxxxxxxxxxxx'}  
];



@Component({
  selector: 'app-standardform',
  templateUrl: './standardform.component.html',
  styleUrls: ['./standardform.component.scss']
})
export class StandardformComponent {

  displayedColumns: string[] = ['item', 'requisito', 'descripcion'];
  dataSource = ELEMENT_DATA;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor() { }

}
