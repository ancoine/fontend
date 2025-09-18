import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private apiUrl = '/api/asset-fixed-decreases';  // Địa chỉ API của backend

  constructor(private http: HttpClient) { }

  // Lấy tất cả dữ liệu từ backend
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // Gọi API từ backend và trả về Observable
  }

  // Thêm mới một dòng (có thể gửi dữ liệu lên backend nếu cần)
  addNewRow(newRow: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newRow);  // Gửi dữ liệu mới lên backend
  }

  // Sửa thông tin dòng
  editRow(index: number, updatedRow: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${updatedRow.stt}`, updatedRow);  // Gửi dữ liệu đã sửa lên backend
  }

  // Xóa một dòng
  deleteRow(index: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${index}`);  // Gửi yêu cầu xóa dòng trên backend
  }
}


