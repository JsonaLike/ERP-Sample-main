import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(private http: HttpClient) { }

  getAllVendors(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Vendor/GetAllVendors', data);
  }

  getVendorById(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Vendor/GetVendorById', data);
  }

  createVendor(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Vendor/CreateVendor', data);
  }

  updateVendor(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Vendor/UpdateVendor', data);
  }

  getLoginEmployeeDetails(data: any): Observable<any> {
      return this.http.post<any>(environment.apiURL + '/Employee/GetLoginEmployeeDetails', {});
  }
}
