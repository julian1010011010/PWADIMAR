import { locale as spanish } from "./i18n/es";
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges,
    Inject,
    LOCALE_ID,
} from "@angular/core";
import { FilesService } from "app/services/files/files.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    DocumentResponse,
    indexDocument,
} from "app/_interfaces/document-by-ship.interface";
import { Router } from "@angular/router";
import {
    MatNativeDateModule,
    MAT_DATE_FORMATS,
    NativeDateAdapter,
    DateAdapter,
    MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
export class ErrorDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
    selector: "app-query-files",
    templateUrl: "./query-files.component.html",
    styleUrls: ["./query-files.component.scss"],
})
export class QueryFilesComponent implements OnInit, OnChanges {
    @Input() tabPanel: string;
    @Input() ship: any;

    formConsult: FormGroup;
    tomoList: number[] = [];
    typeDocument: string[] = [];
    numberExpediente: string[] = [];

    public originalRows: any[];
    rows: any[] = [];
    public isServiceCalled: boolean = false; //variable para evitar que se llame dos veces el servicio por primera vez.

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
            .trim()
            .toLowerCase();

        if (filterValue) {
            this.rows = this.originalRows.filter((row) => {
                return Object.values(row).some((val) =>
                    String(val).toLowerCase().includes(filterValue)
                );
            });
        } else {
            this.rows = this.originalRows;
        }
    }

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dataService: FilesService,
        public dialog: MatDialog,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._fuseTranslationLoaderService.loadTranslations(spanish);
        this.formConsult = this.fb.group({
            numeroTomo: [[]],
            tipoDocumental: [[]],
            numeroRadicadoExpediente: [[]],
            fechaExpedicionDesde: [""],
            fechaExpedicionHasta: [""],
            fechaVigenciaDesde: [""],
            fechaVigenciaHasta: [""],
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.ship && !this.isServiceCalled) {
            this.getIndexByShip();
            this.isServiceCalled = true;
        }
    }

    getIndexByShip() {
        const shipId = this.ship.shipId;
        this.dataService
            .getIndexesOfDocumentsByShip(shipId)
            .subscribe((response: DocumentResponse) => {
                this.originalRows = [...response.indexDocuments];
                this.rows = [...this.originalRows];
                this.tomoList = response.documentQuery.numeroTomo;
                this.typeDocument = response.documentQuery.tipoDocumental;
                this.numberExpediente =
                    response.documentQuery.numeroRadicadoExpediente;

                const formatDate = (date: string) =>
                    date ? new Date(date).toISOString().split("T")[0] : null;

                const fechaExpedicionDesde = formatDate(
                    response.documentQuery.fechaExpedicionDesde
                );
                const fechaExpedicionHasta = formatDate(
                    response.documentQuery.fechaExpedicionHasta
                );
                const fechaVigenciaDesde = formatDate(
                    response.documentQuery.fechaVigenciaDesde
                );
                const fechaVigenciaHasta = formatDate(
                    response.documentQuery.fechaVigenciaHasta
                );

                this.formConsult.patchValue({
                    fechaExpedicionDesde,
                    fechaExpedicionHasta,
                    fechaVigenciaDesde,
                    fechaVigenciaHasta,
                });
            });
    }

    async downloadTomo(pIndexGUID: indexDocument) {
        const downloadTitle =
            await this._fuseTranslationLoaderService.getTranslation(
                "FILES.DOWNLOAD_IN_PROGRESS"
            );
        const downloadMessageBase =
            await this._fuseTranslationLoaderService.getTranslation(
                "FILES.DOWNLOAD_MESSAGE"
            );
 
        const toastRef = this.toastr.info(downloadTitle, downloadMessageBase, {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: false,
        });

        this.dataService
            .downloadPdf(pIndexGUID.indiceCertificadoNave)
            .subscribe(
                (data: Blob) => {
                    const blob = new Blob([data], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${pIndexGUID.numeroTomo}.pdf`;
                    link.click();

                    // Cerrar el toastr de "Descarga en progreso".
                    this.toastr.clear(toastRef.toastId);

                    // Mostrar un nuevo toastr informando que la descarga fue exitosa.
                    this.showSuccess(
                        "Descarga completada de: " +
                            `${pIndexGUID.numeroTomo}.pdf`,
                        "Su documento ha sido descargado exitosamente."
                    );
                },
                (error) => {
                    // Cerrar el toastr de "Descarga en progreso".
                    this.toastr.clear(toastRef.toastId);

                    // Mostrar toastr de error.
                    this.showError(
                        "Descarga Fallida",
                        "Por favor, verifica que el documento esté correctamente adjunto."
                    );
                }
            );
    }

    showSuccess(title: string, message: string) {
        this.toastr.success(message, title, { 
            progressBar: true, 
        });
    }

    showError(
        title: string,
        message: string,
        position: string = "toast-top-right",
        
    ) {
        this.toastr.error(message, title, {
            positionClass: position,
            progressBar: true,
        });
    }

    downloadDocument(pIndexGUID: indexDocument) {
        // Primero mostramos una notificación indicando que la descarga está en progreso
        const toastRef = this.toastr.info(
            "Descarga en progreso . . .",
            `Está descargando ${pIndexGUID.tipoDocumental}.pdf. Por favor, espere...`,
            {
                timeOut: 0, // Esto hará que la notificación no desaparezca hasta que la descarga esté completa o ocurra un error
                progressBar: true,
                closeButton: false,
            }
        );

        this.dataService
            .downloadDocumentByIndexGUID(pIndexGUID.indiceCertificadoNave)
            .subscribe(
                (data: Blob) => {
                    const blob = new Blob([data], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${pIndexGUID.tipoDocumental}.pdf`;
                    link.click();

                    // Una vez que la descarga está completa, cerramos la notificación de "Descarga en progreso"
                    this.toastr.clear(toastRef.toastId);

                    // Y mostramos un mensaje de éxito
                    this.showSuccess(
                        `${pIndexGUID.tipoDocumental}.pdf`,
                        "El documento ha sido descargado exitosamente."
                    );
                },
                (error) => {
                    // Si ocurre un error, también cerramos la notificación de "Descarga en progreso"
                    this.toastr.clear(toastRef.toastId);

                    this.showError(
                        "Descarga Fallida",
                        "Por favor, verifica que el documento esté correctamente adjunto."
                    );
                }
            );
    }

    redirection(row, nameDocument: string) {
        this.router.navigateByUrl("/expedientes/verDocumento", {
            state: {
                registrationNumber: this.ship.registrationNumber,
                file: row.file,
                nameDocument: nameDocument,
            },
        });
    }

    filterTable() {
        const selectedTomo = this.formConsult.get("numeroTomo").value;
        const selectedTipoDocumental =
            this.formConsult.get("tipoDocumental").value;
        const selectedNumeroExpediente = this.formConsult.get(
            "numeroRadicadoExpediente"
        ).value;
        const fechaExpedicionDesde = new Date(
            this.formConsult.get("fechaExpedicionDesde").value
        );
        const fechaExpedicionHasta = new Date(
            this.formConsult.get("fechaExpedicionHasta").value
        );
        const fechaVigenciaDesde = new Date(
            this.formConsult.get("fechaVigenciaDesde").value
        );
        const fechaVigenciaHasta = new Date(
            this.formConsult.get("fechaVigenciaHasta").value
        );

        let filteredRows = [...this.originalRows];

        if (selectedTomo && selectedTomo.length > 0) {
            filteredRows = filteredRows.filter((row) =>
                selectedTomo.includes(row.numeroTomo)
            );
        }

        if (selectedTipoDocumental && selectedTipoDocumental.length > 0) {
            filteredRows = filteredRows.filter((row) =>
                selectedTipoDocumental.includes(row.tipoDocumental)
            );
        }

        if (selectedNumeroExpediente && selectedNumeroExpediente.length > 0) {
            filteredRows = filteredRows.filter((row) =>
                selectedNumeroExpediente.includes(row.numeroRadicadoExpediente)
            );
        }

        if (
            fechaExpedicionDesde &&
            fechaExpedicionDesde.toString() !== "Invalid Date"
        ) {
            fechaExpedicionDesde.setHours(0, 0, 0, 0);
            filteredRows = filteredRows.filter((row) => {
                let rowDate = new Date(row.fechaExpedicion);
                rowDate.setHours(0, 0, 0, 0);
                return rowDate >= fechaExpedicionDesde;
            });
        }

        if (
            fechaExpedicionHasta &&
            fechaExpedicionHasta.toString() !== "Invalid Date"
        ) {
            fechaExpedicionHasta.setHours(0, 0, 0, 0);
            filteredRows = filteredRows.filter((row) => {
                let rowDate = new Date(row.fechaExpedicion);
                rowDate.setHours(0, 0, 0, 0);
                return rowDate <= fechaExpedicionHasta;
            });
        }

        if (
            fechaVigenciaDesde &&
            fechaVigenciaDesde.toString() !== "Invalid Date"
        ) {
            fechaVigenciaDesde.setHours(0, 0, 0, 0);
            filteredRows = filteredRows.filter((row) => {
                let rowDate = new Date(row.fechaExpedicion);
                rowDate.setHours(0, 0, 0, 0);
                return rowDate <= fechaVigenciaDesde;
            });
        }

        if (
            fechaVigenciaHasta &&
            fechaVigenciaHasta.toString() !== "Invalid Date"
        ) {
            fechaVigenciaHasta.setHours(0, 0, 0, 0);
            filteredRows = filteredRows.filter((row) => {
                let rowDate = new Date(row.fechaExpedicion);
                rowDate.setHours(0, 0, 0, 0);
                return rowDate <= fechaVigenciaHasta;
            });
        }

        this.rows = filteredRows;
        this.cdr.detectChanges();
    }
    visualizar(pIndexGUID: indexDocument) {
        this.dataService
            .downloadDocumentByIndexGUID(pIndexGUID.indiceCertificadoNave)
            .subscribe(
                (data: Blob) => {
                    const blob = new Blob([data], { type: "application/pdf" });
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        let base64data = reader.result as string;
                        base64data = base64data.split(",")[1];
                        this.redirection(
                            { file: base64data },
                            pIndexGUID.tipoDocumental
                        );
                    };
                },
                (error) => {
                    this.showError(
                        "Visualización Fallida",
                        "Por favor, verifica que el documento esté correctamente adjunto.",
                        "toast-bottom-right"
                    );
                }
            );
    }
}
