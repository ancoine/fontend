import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../response/PaginationResponse';
import { TableRow } from '../response/TableRow';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private apiUrl = 'http://localhost:8080/api/asset-fixed';

  constructor(private http: HttpClient) { }

getData(page : number, size : number): Observable<PaginationResponse<TableRow>> {

  const params = new HttpParams()
    .set('page', page.toString()) 
    .set('size', size.toString()); 

  
  return this.http.get<PaginationResponse<TableRow>>(`${this.apiUrl}`, { params });
}
  addNewRow(newRow: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newRow);
    
  }

  
  getById(id: number): Observable<TableRow> {
  return this.http.get<TableRow>(`${this.apiUrl}/${id}`);
}
updateRow(id: number, updatedRow: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedRow);
  }



  deleteRow(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}