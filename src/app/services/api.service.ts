import { Injectable } from '@angular/core'; 
import { environment } from 'environments/environment';

@Injectable()
export class ApiService {
  apiUrl = environment.apiUrl;   
  constructor() {}
}