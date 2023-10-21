import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// services
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionsService {

  private baseUrl: string;
  constructor(
      private apiService: ApiService,
      private _http: HttpClient) {
    this.baseUrl = `${this.apiService.apiUrl}/Inspections`;
  }

  getInspectionsByState(stateId, date_from, date_to): Promise<any> {
    const params: HttpParams = new HttpParams()
    .set('State', stateId)
    .set('StartDate', date_from)
    .set('EndDate', date_to);
    return this._http.get(`${this.baseUrl}/getInspectionsByState`, { params } ).toPromise();
  }

  /**
   * Get all the inspection information
   * @param InspectionTypeId 
   */
  getInspectionDataById(inspectionId: number, shipId: number, returnSurveys: boolean = true): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('InspectionId', inspectionId.toString())
      .set('ShipId', shipId.toString())
      .set('ReturnSurveys', returnSurveys.toString());
    return this._http.get(`${this.baseUrl}/getInspectionDataById`, { params } ).toPromise();
  }

  /**
   * Get section data
   * @param Id
   * @param shipId
   * @param inspectionId 
   */
  getSectionDataById(id: number, shipId: number, inspectionId: number): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('Id', id.toString())
      .set('InspectionId', inspectionId.toString())
      .set('ShipId', shipId.toString());
    return this._http.get(`${this.baseUrl}/getDataSectionById`, { params } ).toPromise();
  }

  /**
   * Get inspector information
   * @param username
   */
  getInspectorByUsername(username: string): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('UserName', username);
    return this._http.get(`${this.baseUrl}/getInspectorByUserName`, { params } ).toPromise();
  }

  /**
   * Get ship information
   * @param shipId
   */
  getShipInfoById(shipId: number): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('ShipId', shipId.toString());
    return this._http.get(`${this.baseUrl}/getShipInfoById`, { params } ).toPromise();
  }

  /**
   * Get pdf
   * 
   * @param shipId
   * @param inspectionId
   * @param returnSurveys
   * @param returnAnswers 
   */
  getAllSectionsForPDF( shipId: number, inspectionId: number): Promise<any> {
    const params: HttpParams = new HttpParams()
    .set('InspectionId', inspectionId.toString())
    .set('ShipId', shipId.toString())
    .set('ReturnAnswers', 'true')
    .set('ReturnInspectionSummary', 'true');
    return this._http.get(`${this.baseUrl}/getAllSectionsForPDF`, { params } ).toPromise();
  }

  /**
   * Get ship information
   * @param shipId
   */
  getAttachmentById(attachmentId: number, inspectionId: number): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('id', attachmentId.toString())
      .set('inspectionId', inspectionId.toString());
    return this._http.get(`${this.baseUrl}/getAttachmentById`, { params } ).toPromise();
  }

  // Save the answers in inspection format
  SaveAnswers = (data: any): Promise<any> => {
      return this._http.post(`${this.baseUrl}/saveSectionAnswer`, data).toPromise();
  }

  /**
   * Update inspection type
   * @param data 
   */
  updateInspectionType(data: {inspectionId: number, inspectionTypeId: number }): Promise<any> {
    return this._http.post(`${this.baseUrl}/updateInspectionType`, data).toPromise();
  }

  /**
   * End inspection
   * @param data 
   */
  endInspection(data: {inspectionId: number, shipId: number, conclusions: string }): Promise<any> {
    return this._http.post(`${this.baseUrl}/endInspection`, data).toPromise();
  }

  /**
   * Save inspection conclusions
   * @param data 
   */
  saveInspectionConclusion(data: {inspectionId: number, description: string }): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionConclusions`, data).toPromise();
  }

  /**
   * Save inspection deficiency
   * @param data 
   */
  saveInspectionDeficiency(data: { inspectionId: number, deficiencyId?: number, actionType?: string, description: string }): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionDeficiences`, data).toPromise();
  }

  /**
   * Save inspection attachment
   * @param data 
   */
  saveInspectionAttachment(data: any): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionAttachments`, data).toPromise();
  }

  /**
   * Save inspection breach
   * @param data 
   */
  saveInspectionBreach(data: any): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionBreaches`, data).toPromise();
  }

  /**
   * Save inspection certificate
   * @param data 
   */
  saveInspectionCertificate(data: any): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionCertificates`, data).toPromise();
  }

  /**
   * Get pdf information
   * @param inspectionId
   */
  getPDFInfo(inspectionId: number): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('InspectionId', inspectionId.toString());
    return this._http.get(`${this.baseUrl}/getPDFData`, { params } ).toPromise();
  }

  /**
   * Get pdf information
   * @param inspectionId
   */
  savePDFInspection(data: any): Promise<any> {
    return this._http.post(`${this.baseUrl}/saveInspectionFile`, data).toPromise();
  }

  /**
   * Save ship photo
   * @param data 
   */
  saveShipPhoto(data: any): Promise<any> {
    return this._http.post(`${this.baseUrl}/savePhotoShip`, data).toPromise();
  }

  /**
   * Generate pdf for inspection
   * @param surveyComponent 
   * @param inspection 
   */
  async generateInspectionPDF(surveyComponent: any, inspection): Promise<any> {
    const processResult = { success: true, error: null };
    surveyComponent.setRendering(true);

    try {
      const surveyJSON = await this.getAllSectionsForPDF(inspection.shipId, inspection.inspectionId);

      const survey = JSON.parse(surveyJSON.survey);
      const anwers = JSON.parse(surveyJSON.answer.answer);

      surveyComponent.loadSurvey(survey, anwers);
      const fileData = await surveyComponent.saveSurveyToPdf('saveAsBase64');

      const data = { 
          inspectionId: inspection.inspectionId,
          inspectionFileName: `${inspection.settled}.pdf`,
          inspectionFile: fileData
      };
      await this.savePDFInspection(data);
    } catch (error) {
      console.error('loadPDF', error);
      processResult.success = false;
      processResult.error = error.message;
    }
    surveyComponent.setRendering(false);

    return processResult;
  }
}
