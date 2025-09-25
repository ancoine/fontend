import { Component, signal } from '@angular/core';
import { TableRow } from './response/TableRow';  

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header-layout/header-layout.component';
import { SidebarComponent } from "./shared/sidebar-layout/sidebar-layout.component";
import { AddVoucherComponent } from "./shared/maincontent-layout/add-voucher.component"; 
import { TableData } from "./shared/maincontent-layout/table-component";
import { CommonModule } from '@angular/common';
import {EditVoucherForm} from "./shared/maincontent-layout/edit-voucher.component";
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, TableData, AddVoucherComponent, CommonModule,EditVoucherForm,ToastrModule,BrowserAnimationsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],  // Sửa từ styleUrl thành styleUrls
})
export class App {
  protected readonly title = signal('quanlyts');
  showAddForm = false;  // Thêm biến này
    editingRow: TableRow | null = null;
  // Phương thức để chuyển đổi view
  toggleView(showForm: boolean) {
    this.showAddForm = showForm;
    this.editingRow = null; // khi mở add thì reset edit
  }
  onEditRow(row: TableRow) {
  this.editingRow = row;   // gán vào state
  this.showAddForm = false; // ẩn form add nếu đang mở
}

  closeEdit() {
    this.editingRow = null;
  }
}
