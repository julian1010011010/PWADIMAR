import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Utils from '../../main/app-common/utils';
// services
import { ApiService } from '../api.service';

@Injectable()
export class AppCommonService {
    private baseUrl: string;
    utils = new Utils();
    constructor(
        private apiService: ApiService,
        private _http: HttpClient) {
        this.baseUrl = `${this.apiService.apiUrl}/Common`
    }

    public GetReportsByModule = (reportType: string): Observable<any> => {
        let params: HttpParams = new HttpParams();
        
        params = params.set('module', reportType);
 
        return this._http.get(`${this.baseUrl}/getAllReports`, { params: params })
            .pipe(map((response: Response) => <any>response));
    }

    public GetReport = (reportId: string): Observable<any> => {
        let params: HttpParams = new HttpParams();
        
        params = params.set('name', reportId);
 
        return this._http.get(`${this.baseUrl}/getReport`, { params: params })
            .pipe(map((response: Response) => <any>response));
    }

    public ExecuteReport = (data: any): Observable<any> => { 
        return this._http.post(`${this.baseUrl}/executeReport`, data)
            .pipe(map((response: Response) => <any>response));
    }

    public GetDataGenericByName = (nameList: string, parentId?: any, additionalId?: any,  additionalId2?: any): Observable<any> => {
        let params: HttpParams = new HttpParams();
        
        params = params.set('Name', nameList);

        if(parentId) {
            params = params.set('ParentId', parentId.toString());
        }

        if(additionalId) {
            params = params.set('AdditionalId', additionalId.toString());
        }

        if(additionalId2) {
            params = params.set('AdditionalId2', additionalId2.toString());
        }
 
        return this._http.get(`${this.baseUrl}/getDataGenericByName`, { params: params })
            .pipe(map((response: Response) => <any>response));
    }

    public GetDataGenericBySubLista = (objList: any): Observable<any> => {
        let params = this.utils.dataServiceGet(objList);
        return this._http.get(`${this.baseUrl}/getDataGenericByName`, { params: params })
            .pipe(map((response: Response) => <any>response));
    }
}
