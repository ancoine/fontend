import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TableDataService } from '../../services/table-date.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TableRow {
  asserFixedId: number;
  voucherCode: string;
  voucherDate: string;
  code: string;
  name: string;
}

interface Filters {
  voucherNo: string;
  voucherDate: string;
  code: string;
  name: string;
}

@Component({
  selector: 'table-data',
  templateUrl: './table.component.html',
  imports: [CommonModule, FormsModule],
})
export class TableData implements OnInit {
  @Output() showAddForm = new EventEmitter<boolean>(); // Thêm @Output event

  data: TableRow[] = [];
  filteredRows: TableRow[] = [];
  editing: TableRow | null = null;
  isAdding: boolean = false;
  
  // Phân trang
  pageIndex: number = 0;
  pageSize: number = 10;
  
  // Bộ lọc
  filters: Filters = {
    voucherNo: '',
    voucherDate: '',
    code: '',
    name: ''
  };

  constructor(private tableDataService: TableDataService) { } // Bỏ Router

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tableDataService.getData().subscribe(
      (response) => {
        this.data = response;
        this.applyFilters();
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu từ backend:', error);
      }
    );
  }

  // Áp dụng bộ lọc
  applyFilters(): void {
    this.filteredRows = this.data.filter(row => {
      return (!this.filters.voucherNo || row.voucherCode.toLowerCase().includes(this.filters.voucherNo.toLowerCase())) &&
             (!this.filters.voucherDate || row.voucherDate === this.filters.voucherDate) &&
             (!this.filters.code || row.code.toLowerCase().includes(this.filters.code.toLowerCase())) &&
             (!this.filters.name || row.name.toLowerCase().includes(this.filters.name.toLowerCase()));
    });
    this.pageIndex = 0;
  }

  // Xóa bộ lọc
  clearFilters(): void {
    this.filters = {
      voucherNo: '',
      voucherDate: '',
      code: '',
      name: ''
    };
    this.applyFilters();
  }

  // Navigate đến form thêm mới - CHỈ GIỮ LẠI 1 METHOD
  startAdd(): void {
    this.showAddForm.emit(true); // Emit event thay vì navigate
  }

  // Chỉnh sửa dòng theo object
  editRowByObject(row: TableRow): void {
    this.isAdding = false;
    this.editing = { ...row };
  }

  // Sao chép dòng
  duplicate(row: TableRow): void {
    const duplicatedRow = {
      ...row,
      asserFixedId: 0,
      voucherCode: row.voucherCode + '_copy'
    };
    
    this.tableDataService.addNewRow(duplicatedRow).subscribe(
      (response) => {
        this.data.push(response);
        this.applyFilters();
      },
      (error) => {
        console.error('Có lỗi xảy ra khi sao chép dòng:', error);
      }
    );
  }

  // Xóa dòng
  deleteRow(asserFixedId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa dòng này?')) {
      this.tableDataService.deleteRow(asserFixedId).subscribe(
        () => {
          this.data = this.data.filter(row => row.asserFixedId !== asserFixedId);
          this.applyFilters();
        },
        (error) => {
          console.error('Có lỗi xảy ra khi xóa dòng:', error);
        }
      );
    }
  }

  // Menu thêm
  more(row: TableRow): void {
    console.log('More options for row:', row);
  }

  // Phân trang
  pagedRows(): TableRow[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredRows.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.filteredRows.length / this.pageSize);
  }

  pages(): number[] {
    const total = this.totalPages();
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(0, this.pageIndex - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible);
    
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goFirst(): void {
    this.pageIndex = 0;
  }

  goLast(): void {
    this.pageIndex = this.totalPages() - 1;
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages() - 1) {
      this.pageIndex++;
    }
  }

  goPage(page: number): void {
    this.pageIndex = page;
  }
}