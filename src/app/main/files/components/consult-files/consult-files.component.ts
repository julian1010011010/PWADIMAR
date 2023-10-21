import { Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseMessageDialogComponent } from '@fuse/components/message-dialog/message-dialog.component';
import { locale as spanish } from './i18n/es';
import { FilesService } from '../../../../services/files/files.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppCommonService } from 'app/services/app-common/app-common.service';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { Validations } from '../../../files/validations';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-consult-files',
  templateUrl: './consult-files.component.html',
  styleUrls: ['./consult-files.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class ConsultFilesComponent implements OnInit {
  @Input() createFile: boolean;
  formConsultAdvanced: boolean = false;
  showResult: boolean = false;
  isLoading: boolean = false;
  formBasic: FormGroup;
  formAdvanced: FormGroup;
  message: string;
  arrayListGeneric = new Array<string>();
  columns = [
    { prop: 'registrationNumber', name: 'Matrícula' },
    { prop: 'omiNic', name: 'OMI/NIC' },
    { prop: 'shipName', name: 'Nombre Nave' },
    { prop: 'operationStatus', name: 'Estado' }
  ];
  rows: any[];
  validatedAlphaNumeric: any = /^[a-zñ A-ZÑ0-9-]+$/;
  navegationType: any;
  shipSubgroups: any;
  registryPorts: any;
  shipGroups: any;
  trafficType: any;
  shipStatus: any;
  dateMax: any;
  showButton: boolean;
  requireFieldMax: boolean = false;
  requireFieldMin: boolean = false;
  valueMin: any;
  valueMax: any;
  requireGrossdMax: boolean;
  requireGrossdMin: boolean;
  constructor(private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private filesServices: FilesService,
    private commonServices: AppCommonService,
    private datePipe: DatePipe,
    private router: Router,
    public authService: AuthService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) 
  {
    this.loadForm();
  }

  ngOnInit(): void {
    this.arrayListGeneric = ['EstadosNave', 'TiposTrafico', 'GruposNave', 'Capitanias', 'TiposNavegacion'];
    this.loadList();
    this.formAdvanced.controls['SubgroupId'].disable();
    this.dateMax = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this._fuseTranslationLoaderService.loadTranslations(spanish);
    this.showButton = this.roleShowButton();
  }

  loadForm() {
    this.formBasic = this._formBuilder.group({
      RegistrationNumber: ['', [Validators.maxLength(30), Validators.pattern(this.validatedAlphaNumeric)]],
      ShipName: ['']
    });
    this.formAdvanced = this._formBuilder.group({
      RegistrationNumber: ['', [Validators.maxLength(30), Validators.pattern(this.validatedAlphaNumeric)]],
      ShipName: [''],
      OmiNic: ['', [Validators.pattern(this.validatedAlphaNumeric)]],
      MinGrossTonnage: ['', [Validators.min(0)]],
      MaxGrossTonnage: ['', [Validators.max(10000000)]],
      MinNetTonnage: ['', [Validators.min(0)]],
      MaxNetTonnage: ['', [Validators.max(10000000)]],
      RegistrationPort: [''],
      RegistrationPortId: [''],
      MinBuiltDate: ['', Validations.dateValidators],
      MaxBuiltDate: ['', Validations.dateValidators],
      OperationStatus: [''],
      OperationStatusId: [''],
      NavegationType: [''],
      NavegationTypeId: [''],
      Owner: [''],
      TrafficType: [''],
      TrafficTypeId: [''],
      Group: [''],
      GroupId: [''],
      Subgroup: [''],
      SubgroupId: ['']
    });
  }

  loadList() {
    this.arrayListGeneric.forEach(list => {
      this.commonServices.GetDataGenericByName(list).subscribe(resp => {
        list == 'EstadosNave' ? this.shipStatus = resp : list == 'TiposTrafico' ? this.trafficType = resp : list == 'GruposNave' ? this.shipGroups = resp : list == 'Capitanias' ? this.registryPorts = resp : list == 'TiposNavegacion' ? this.navegationType = resp : undefined;
      })
    });

  }
  consultBasic() {
    this.isLoading = true;
    const filterBasic = this.formBasic.value;
    this.filesServices.getAllDataByRegistrationNumberAsync(filterBasic).subscribe(resp => {
      if (resp.length > 0) {
        this.rows = resp;
        this.showResult = true;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.notificationMessage('No se encontraron resultados.');
      }
    },
    error => {
      this.isLoading = false;
      this.notificationMessage('Debe ingresar almenos un valor en el formulario.');
    });
  }
  actConsult() {
    this.formConsultAdvanced = !this.formConsultAdvanced;
    this.formBasic.reset();
    this.formAdvanced.reset();
    this.showResult = false;
    this.requireFieldMin = false;
    this.requireFieldMax = false;
    this.requireGrossdMax = false;
    this.requireGrossdMin = false;
  }
  consultAdvanced() {
    this.isLoading = true;
    const filterAdvanced = this.formAdvanced.value;
    this.filesServices.getAllDataByEntityAsync(filterAdvanced).subscribe(resp => {
      if (resp.length > 0) {
        this.rows = resp;
        this.showResult = true;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.notificationMessage('No se encontraron resultados.');
      }
    },
      error => {
        this.isLoading = false;
        this.notificationMessage('Debe ingresar almenos un valor en el formulario.');
      });
  }
  selectOperationStatus(value) {
    if (!isNullOrUndefined(value)) { this.shipStatus.find(status => status.id == value ? this.formAdvanced.controls['OperationStatus'].setValue(status.description) : undefined); }
    else {
      this.formAdvanced.controls['OperationStatusId'].setValue(null);
      this.formAdvanced.controls['OperationStatus'].setValue(null);
    }
  }
  selectTrafficType(value) {
    if (!isNullOrUndefined(value)) { this.trafficType.find(traffic => traffic.id == value ? this.formAdvanced.controls['TrafficType'].setValue(traffic.description) : undefined); }
    else {
      this.formAdvanced.controls['TrafficTypeId'].setValue(null);
      this.formAdvanced.controls['TrafficType'].setValue(null);
    }
  }
  selectGroup(value) {
    if (!isNullOrUndefined(value)) {
      this.shipSubgroups = null;
      value ? this.formAdvanced.controls['SubgroupId'].enable() : '';
      this.shipGroups.find(group => group.id == value ? this.formAdvanced.controls['Group'].setValue(group.description) : undefined);
      this.commonServices.GetDataGenericBySubLista({ 'Name': 'SubgruposNave', 'ParentId': this.formAdvanced.get('GroupId').value }).subscribe(resp => {
        this.shipSubgroups = [...resp];
      });
    }
    else {
      this.formAdvanced.controls['GroupId'].setValue(null);
      this.formAdvanced.controls['Group'].setValue(null);
      this.formAdvanced.controls['SubgroupId'].disable();
      this.shipSubgroups = null;
    }
  }
  selectRegistrationPort(value) {
    if (!isNullOrUndefined(value)) { this.registryPorts.find(port => port.id == value ? this.formAdvanced.controls['RegistrationPort'].setValue(port.description) : undefined); }
    else {
      this.formAdvanced.controls['RegistrationPortId'].setValue(null);
      this.formAdvanced.controls['RegistrationPort'].setValue(null);
    }
  }
  selectNavegationType(value) {
    if (!isNullOrUndefined(value)) { this.navegationType.find(navegation => navegation.id == value ? this.formAdvanced.controls['NavegationType'].setValue(navegation.description) : undefined); }
    else {
      this.formAdvanced.controls['NavegationTypeId'].setValue(null);
      this.formAdvanced.controls['NavegationType'].setValue(null);
    }
  }
  selectSubgroup(value) {
    if (!isNullOrUndefined(value) && value != '') { this.shipSubgroups.find(subgroup => subgroup.id == value ? this.formAdvanced.controls['Subgroup'].setValue(subgroup.description) : undefined); }
    else {
      this.formAdvanced.controls['SubgroupId'].setValue(null);
      this.formAdvanced.controls['Subgroup'].setValue(null);
    }
  }

  createFileService() {
    this.isLoading = true;
    const createFile = this.formBasic.value;
    this.filesServices.createShipFile(createFile).subscribe(resp => {
      if (resp != 0) {
        this.isLoading = false;
        this.router.navigate(['/expedientes/detalle/' + createFile.RegistrationNumber]);
      } else {
        this.isLoading = false;
        this.notificationMessage('El numero de matrícula no existe.');
      }
    },
      error => {
        this.isLoading = false;
        this.notificationMessage('Error en la creación del expediente.');
      });
  }

  roleShowButton(): boolean {
    const roles = [this.authService.systemRoles.FILES_SUPERVISOR, this.authService.systemRoles.ADMIN];
    let showButton = false;
    roles.forEach(role => {
      if (!showButton) {
        showButton = this.authService.authData.roles.includes(role);
      }
    });
    return showButton;
  }
  notificationMessage(message) {
    const config = { data: { title: 'Mensaje del sistema', message: message, buttonText: 'Cerrar', type: 'warning' } };
    this.dialog.open(FuseMessageDialogComponent, config);
  }

  validFieldMin(value) {
    if (!isNullOrUndefined(this.formAdvanced.value.MaxNetTonnage) && value != "") {
      const valueMax = this.formAdvanced.value.MinNetTonnage > this.formAdvanced.value.MaxNetTonnage ? this.formAdvanced.value.MaxNetTonnage : value;
      this.formAdvanced.controls['MinNetTonnage'].setValue(valueMax);
    }
    this.valideRequired();
  }

  validFieldMax(value) {
    if (!isNullOrUndefined(this.formAdvanced.value.MinNetTonnage) && value != "") {
      const valueMin = this.formAdvanced.value.MaxNetTonnage < this.formAdvanced.value.MinNetTonnage ? this.formAdvanced.value.MinNetTonnage : value;
      this.formAdvanced.controls['MaxNetTonnage'].setValue(valueMin);
    }
    this.valideRequired();
  }

  valideRequired() {
    this.requireFieldMax = !isNullOrUndefined(this.formAdvanced.value.MaxNetTonnage) && this.formAdvanced.value.MaxNetTonnage != '' ? false : true;
    this.requireFieldMin = !isNullOrUndefined(this.formAdvanced.value.MinNetTonnage) && this.formAdvanced.value.MinNetTonnage != '' ? false : true;
    if ((isNullOrUndefined(this.formAdvanced.value.MaxNetTonnage) || this.formAdvanced.value.MaxNetTonnage == '')
      && (isNullOrUndefined(this.formAdvanced.value.MinNetTonnage) || this.formAdvanced.value.MinNetTonnage == '')) {
      this.requireFieldMin = false;
      this.requireFieldMax = false;
      this.formAdvanced.controls['MinNetTonnage'].setValue(null);
      this.formAdvanced.controls['MaxNetTonnage'].setValue(null);
    }
  }

  validGrossdMin(value) {
    if (!isNullOrUndefined(this.formAdvanced.value.MaxGrossTonnage) && value != "") {
      const valueMax = this.formAdvanced.value.MinGrossTonnage > this.formAdvanced.value.MaxGrossTonnage ? this.formAdvanced.value.MaxGrossTonnage : value;
      this.formAdvanced.controls['MinGrossTonnage'].setValue(valueMax);
    }
    this.valideGrossRequired();
  }

  validGrossMax(value) {
    if (!isNullOrUndefined(this.formAdvanced.value.MinGrossTonnage) && value != "") {
      const valueMin = this.formAdvanced.value.MaxGrossTonnage < this.formAdvanced.value.MinGrossTonnage ? this.formAdvanced.value.MinGrossTonnage : value;
      this.formAdvanced.controls['MaxGrossTonnage'].setValue(valueMin);
    }
    this.valideGrossRequired();
  }

  valideGrossRequired() {
    this.requireGrossdMax = !isNullOrUndefined(this.formAdvanced.value.MaxGrossTonnage) && this.formAdvanced.value.MaxGrossTonnage != '' ? false : true;
    this.requireGrossdMin = !isNullOrUndefined(this.formAdvanced.value.MinGrossTonnage) && this.formAdvanced.value.MinGrossTonnage != '' ? false : true;
    if ((isNullOrUndefined(this.formAdvanced.value.MaxGrossTonnage) || this.formAdvanced.value.MaxGrossTonnage == '')
      && (isNullOrUndefined(this.formAdvanced.value.MinGrossTonnage) || this.formAdvanced.value.MinGrossTonnage == '')) {
        this.requireGrossdMax = false;
        this.requireGrossdMin = false;
      this.formAdvanced.controls['MinGrossTonnage'].setValue(null);
      this.formAdvanced.controls['MaxGrossTonnage'].setValue(null);
    }
  }
}
