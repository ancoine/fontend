import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DropdownItem {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DropdownDataService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAssets(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(`${this.baseUrl}/assets`);
  }

  getProcessingMethods(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(`${this.baseUrl}/processing-methods`);
  }

  getDecreaseReasons(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(`${this.baseUrl}/decrease-reasons`);
  }

}