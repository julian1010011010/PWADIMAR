

export interface indexDocument {
    shipId?: number;
    numeroTomo?: number;
    tipoDocumental?: string;
    numeroRadicadoExpediente?: string;
    fechaExpedicion?: string;
    fechaVigencia?: string;
    indiceCertificadoNave?: string;
}

export interface DocumentQuery {
    numeroRadicadoExpediente: string[];
    tipoDocumental: string[];
    numeroTomo: number[];
    fechaVigenciaDesde: string;
    fechaVigenciaHasta: string;
    fechaExpedicionDesde: string;
    fechaExpedicionHasta:string;
}

export interface DocumentResponse {
    indexDocuments: indexDocument[];
    documentQuery: DocumentQuery; 
}