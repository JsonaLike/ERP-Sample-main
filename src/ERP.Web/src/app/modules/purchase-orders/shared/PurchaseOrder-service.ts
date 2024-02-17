import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  constructor(private http: HttpClient) { }

  getAllPurchaseOrders(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/PurchaseOrders/GetAllPurchaseOrders', data);
  }
  getAllPurchaseOrderItems(data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/PurchaseOrders/GetAllPurchaseOrderItems', data);
}

  getPurchaseOrderById(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/PurchaseOrders/GetPurchaseOrderById', data);
  }

  createPurchaseOrder(data: any): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/PurchaseOrders/CreatePurchaseOrder', data);
}


  updatePurchaseOrder(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/PurchaseOrders/UpdatePurchaseOrder', data);
  }

  getLoginPurchaseOrderDetails(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/PurchaseOrders/GetLoginPurchaseOrderDetails', {});
  }
}
