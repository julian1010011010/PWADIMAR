import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Utils from '../../main/app-common/utils';

// services
import { ApiService } from '../api.service';
import { DocumentResponse } from 'app/_interfaces/document-by-ship.interface';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  utils;
  private baseUrl: string;
  baseUrlDocuments: string;

  constructor(
    private apiService: ApiService,
    private _http: HttpClient) {
    this.utils = new Utils();
    this.baseUrl = `${this.apiService.apiUrl}/Files`;
    this.baseUrlDocuments = `${this.apiService.apiUrl}/Documents`;
  }

  attachExcelIndexDocument(file: File, pIndexDocument: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pIndexDocument',JSON.stringify(pIndexDocument));
    const headers = new HttpHeaders();
    return this._http.post(`${this.baseUrlDocuments}/AttachExcelIndexDocument`, formData, { headers });
  }


  attachPdfIndexDocument(file: File, pShipFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pShipFile', JSON.stringify(pShipFile));
    return this._http.post(`${this.baseUrlDocuments}/AttachPdfIndexDocument`, formData);
  }
  

  replacePdfIndexDocument(file: File, pShipFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pShipFile', JSON.stringify(pShipFile));
    return this._http.post(`${this.baseUrlDocuments}/ReplacePdfIndexDocument`, formData);
  }
  

  replaceExcelIndexDocument(file: File, pIndexDocument: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pIndexDocument',JSON.stringify(pIndexDocument));
    const headers = new HttpHeaders();
    return this._http.post(`${this.baseUrlDocuments}/ReplaceExcelIndexDocument`, formData, { headers });
  }

  GetIndexesOfDocumentsTomoByShip(shipId: number) : Observable<any>{
    return this._http.get<any>(`${this.baseUrlDocuments}/GetIndexesOfDocumentsTomoByShip/${shipId}`);
  }
  
  getAllTomosByShipId(shipId: number) : Observable<any>{
    return this._http.get<any>(`${this.baseUrlDocuments}/GetAllTomosByShipId/${shipId}`);
  }

  downloadDocumentByIndexGUID(pIndexGUID: string): Observable<Blob> {
    const url = `${this.baseUrlDocuments}/DownloadDocumentByIndexGUID?pIndexGUID=${pIndexGUID}`;
    return this._http.get(url, { responseType: 'blob' })
  }

  downloadPdf(pIndexGUID: string): Observable<Blob> {
    const url = `${this.baseUrlDocuments}/DownloadTomoDocumentByIndexGUID?pIndexGUID=${pIndexGUID}`;
    return this._http.get(url, { responseType: 'blob' });
  }

  getIndexesOfDocumentsByShip(shipId: number): Observable<DocumentResponse> {  
    return this._http.get<DocumentResponse>(`${this.baseUrlDocuments}/getIndexesOfDocumentsByShip?pShipId=${shipId}`);
  }

  downloadExcelPlantilla(): Observable<Blob> {
    return this._http.get(`${this.baseUrlDocuments}/DownLoadExcelPlantilla`, { responseType: 'blob' });
  } 

  uploadPdfIndexDocument(file: File, pShipFile: any): Observable<any> { 
    const formData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pShipFile',JSON.stringify(pShipFile));
    return this._http.post(`${this.baseUrlDocuments}/uploadPdfIndexDocument`, formData);
  }

  uploadExcelIndexDocument(file: File, pShipFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('pfileUpload', file);
    formData.append('pShipFile',JSON.stringify(pShipFile));
    return this._http.post(`${this.baseUrlDocuments}/uploadExcelIndexDocument`, formData); 
  }

  getAllDataByEntityAsync(filterAdvanced): Observable<any> {
    let params = this.utils.dataServiceGet(filterAdvanced);
    return this._http.get(`${this.baseUrl}/getAllDataByEntityAsync`, { params: params })
  }

  getAllDataByRegistrationNumberAsync(filterBasic): Observable<any> {
    let params = this.utils.dataServiceGet(filterBasic);
    return this._http.get(`${this.baseUrl}/getAllDataByRegistrationNumberAsync`, { params: params })
  }

  getShipFile(registrationNumber): Observable<any> {
    let params = this.utils.dataServiceGet(registrationNumber);
    return this._http.get(`${this.baseUrl}/getShipFile`, { params: params })
  }

  getRegistrationDocument(idFile): Observable<any> {
    let params = this.utils.dataServiceGet(idFile);
    return this._http.get(`${this.baseUrlDocuments}/getRegistrationDocument`, { params: params })
  }

  insertRegistrationDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertRegistrationDocument`, dataFile)
  }

  insertOtherDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertOtherDocument`, dataFile)
  }

  insertModificationDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertModificationDocument`, dataFile)
  }

  insertLegalDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertLegalDocument`, dataFile)
  }

  insertInspectionDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertInspectionDocument`, dataFile)
  }

  insertCertificateDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertCertificateDocument`, dataFile)
  }
  
  insertCancellationDocument(dataFile): Observable<any> {
    return this._http.post(`${this.baseUrlDocuments}/insertCancellationDocument`, dataFile)
  }
  
  createShipFile(createShipFile): Observable<any> {
    return this._http.post(`${this.baseUrl}/createShipFile`, createShipFile)
  }
}
