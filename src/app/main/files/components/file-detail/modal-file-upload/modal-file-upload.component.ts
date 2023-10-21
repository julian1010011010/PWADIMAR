import { Component, Inject, LOCALE_ID, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { AppCommonService } from "app/services/app-common/app-common.service";
import { locale as spanish } from "./i18n/es";
import { ModalConfirmationComponent } from "./../modal-confirmation/modal-confirmation.component";
import { FuseMessageDialogComponent } from "@fuse/components/message-dialog/message-dialog.component";
import { isNullOrUndefined } from "util";
import { DatePipe } from "@angular/common";
import { Validations } from "./../../../../files/validations";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { FilesService } from "app/services/files/files.service";
import { ShipFile } from "../load-files/load-files.component";
import { indexDocument } from "app/_interfaces/document-by-ship.interface";

registerLocaleData(localeFr);

export interface DialogData {
    isReplace: boolean;
    panel: string;
    shipId: string;
    esExpediente: boolean;
    objShipFile: ShipFile;
    objExcelFile: indexDocument;
    documentType: string;
    fileName: string;
}

@Component({
    selector: "app-modal-file-upload",
    templateUrl: "./modal-file-upload.component.html",
    styleUrls: ["./modal-file-upload.component.scss"],
    providers: [{ provide: LOCALE_ID, useValue: "fr" }],
})
export class ModalFileUploadComponent implements OnInit {
    isLoading: boolean = false;
    typeFilePdf: string;
    typeFileXslx: string;
    fileToUpload: File;
    loadFiles: FormGroup;
    registrationDocumentTypeId: any[];
    cancellationDocumentTypeId: any;
    dateMax: any;
    count: number = 0;
    acceptedFileTypes: string;

    constructor(
        private dialogRef: MatDialogRef<ModalFileUploadComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private filesServices: FilesService,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {}
    ngOnInit(): void {
        this._fuseTranslationLoaderService.loadTranslations(spanish);
        this.modalForm(this.data.panel);
        this.dateMax = this.datePipe.transform(new Date(), "yyyy-MM-dd");
        if (
            this.data.documentType === "excel" ||
            this.data.esExpediente === false
        ) {
            this.acceptedFileTypes =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"; // Solo permitir archivos Excel.
        } else if (
            this.data.documentType === "pdf" ||
            this.data.esExpediente === true
        ) {
            this.acceptedFileTypes = "application/pdf";
        }
    }

    modalForm(modalTab: any) {
        this.loadFiles = this._formBuilder.group({
            Id: [null],
            FileName: ["", [Validators.required]],
            ShipId: ["", [Validators.required]],
            File: ["", [Validators.required]],
            RegistrationDocumentTypeId: ["", [Validators.required]],
            IssuanceDate: [
                "",
                [Validators.required, Validations.dateValidators],
            ],
        });
        this.loadFiles.get("ShipId").setValue(this.data.shipId);
    }

    onSiClick() {
        const {
            objShipFile,
            objExcelFile,
            isReplace,
            documentType,
            esExpediente,
        } = this.data;

        this.isLoading = true;

        let operationObservable; // Observables basados en la operación

        // Decidir cuál operación ejecutar basada en las condiciones
        switch (documentType) {
            case "excel":
                if (isReplace) {
                    operationObservable =
                        this.filesServices.replaceExcelIndexDocument(
                            this.fileToUpload,
                            objExcelFile
                        );
                } else {
                    operationObservable =
                        this.filesServices.attachExcelIndexDocument(
                            this.fileToUpload,
                            objExcelFile
                        );
                }
                break;

            case "pdf":
                if (isReplace) {
                    operationObservable =
                        this.filesServices.replacePdfIndexDocument(
                            this.fileToUpload,
                            objShipFile
                        );
                } else {
                    operationObservable =
                        this.filesServices.attachPdfIndexDocument(
                            this.fileToUpload,
                            objShipFile
                        );
                }
                break;

            default:
                if (esExpediente) {
                    operationObservable =
                        this.filesServices.uploadPdfIndexDocument(
                            this.fileToUpload,
                            objShipFile
                        );
                } else {
                    operationObservable =
                        this.filesServices.uploadExcelIndexDocument(
                            this.fileToUpload,
                            objShipFile
                        );
                }
                break;
        }

        // Suscribirse al observable y manejar respuestas
        if (operationObservable) {
            operationObservable.subscribe(
                (resp) => this.handleSuccessResponse(resp),
                (error) => this.handleErrorResponse(error)
            );
        }
    }

    handleSuccessResponse(resp) { 
        const message = resp.message || "Operación realizada con éxito.";
        this.modalNotificationWhitErrorMessage(true, message);
        this.dialogRef.close(resp);
        this.isLoading = false;
    }

    handleErrorResponse(error) {
        const errorMessage = error.error || "Ocurrió un error.";
        this.modalNotificationWhitErrorMessage(false, errorMessage);
        this.isLoading = false;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
        this.loadFiles.reset();
    }

    loadFileInput(file: FileList) {
        // Obtener el archivo seleccionado.
        this.fileToUpload = file.item(0);

        // Validación para expediente en formato PDF.
        if (
            this.data.esExpediente === true &&
            this.fileToUpload.type !== "application/pdf"
        ) {
            this.messsageNotification("El archivo debe ser en formato PDF");
        }

        // Validación para expediente en formato Excel.
        if (
            this.data.esExpediente === false &&
            this.fileToUpload.type !==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            this.fileToUpload.type !== "application/vnd.ms-excel"
        ) {
            this.messsageNotification("El archivo debe ser en formato EXCEL");
        }

        // Establecer el nombre del archivo en el formulario.
        this.loadFiles.get("FileName").setValue(this.fileToUpload.name);

        // Leer el archivo y codificarlo como DataURL.
        let reader = new FileReader();
        reader.onload = (event: any) => {
            // Obtener el contenido codificado del archivo.
            let resultFile = event.target.result.split(",");
            this.loadFiles.get("File").setValue(resultFile[1]);
        };
        reader.readAsDataURL(this.fileToUpload);
    }

    messsageNotification(notification) {
        const config = {
            data: {
                title: "Mensaje del sistema",
                message: notification,
                buttonText: "Aceptar",
                type: "warning",
            },
        };
        this.dialog.open(FuseMessageDialogComponent, config);
        this.fileToUpload = undefined;
        return false;
    }

    countString() {
        this.count = this.loadFiles.value.Description.length;
    }

    modalNotification(message: boolean) {
        const modalMsg = message
            ? "Archivo cargado con éxito"
            : "Falla en la carga del archivo";
        const modalType = message ? "success" : "error";
        const config = {
            data: {
                title: "Mensaje del sistema",
                message: modalMsg,
                buttonText: "Aceptar",
                type: modalType,
            },
        };
        this.dialog.open(FuseMessageDialogComponent, config);
        this.dialogRef.close(message);
    }
    modalNotificationWhitErrorMessage(success: boolean, errorMessage?: string) {
        const modalType = success ? "success" : "error";
        const config = {
            data: {
                title: "Mensaje del sistema",
                message: errorMessage,
                buttonText: "Aceptar",
                type: modalType,
            },
        };
        this.dialog.open(FuseMessageDialogComponent, config);
        this.dialogRef.close(success);
    }
}
