import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService {

  
  constructor(private http: HttpClient) { }

  getAllInventoryItems(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/InventoryItems/GetAllInventoryItems', data);
  }

  geInventoryItemById(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/InventoryItems/GetInventoryItemById', data);
  }

  createInventoryItem(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/InventoryItems/CreateInventoryItem', data);
  }

  updateInventoryItem(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/InventoryItems/UpdateInventoryItem', data);
  }

  getLoginEmployeeDetails(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Employee/GetLoginEmployeeDetails', {});
  }
}
