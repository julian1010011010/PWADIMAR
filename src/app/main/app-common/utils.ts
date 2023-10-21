import { HttpParams } from '@angular/common/http';

export default class Utils {
    dataServiceGet(dataJson) {
        let params: HttpParams = new HttpParams();
        for (var key in dataJson) {
            if (dataJson.hasOwnProperty(key) && dataJson[key] != null && dataJson[key] != undefined && dataJson[key] != '') {
                params = params.set(key, dataJson[key]);
            }
        }
        return params;
    }
}