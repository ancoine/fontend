import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private apiUrl = 'http://localhost:8080/api/asset-fixed-decreases';

  constructor(private http: HttpClient) { }

  // Lấy tất cả dữ liệu từ backend
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Thêm mới một dòng
  addNewRow(newRow: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newRow);
  }

  // Sửa thông tin dòng - Sửa lại để sử dụng asserFixedId
  updateRow(id: number, updatedRow: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedRow);
  }

  // Xóa một dòng
  deleteRow(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}