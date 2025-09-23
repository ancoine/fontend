import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header-layout/header-layout.component';
import { SidebarComponent } from "./shared/sidebar-layout/sidebar-layout.component";
import { AddVoucherComponent } from "./shared/maincontent-layout/add-voucher.component"; 
import { TableData } from "./shared/maincontent-layout/table-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ HeaderComponent, SidebarComponent, TableData, AddVoucherComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  
})
export class App {
  protected readonly title = signal('quanlyts');
  showAddForm = false; // Thêm biến này

  // Phương thức để chuyển đổi view
  toggleView(showForm: boolean) {
    this.showAddForm = showForm;
  }
}