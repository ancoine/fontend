import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TableDataService } from '../../services/table-date.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableRow } from '../../response/TableRow';

interface Filters {
  voucherNo: string;
  voucherDate: string;
  code: string;
  name: string;
  assetFixedId: number;
}

@Component({
  selector: 'table-data',
  templateUrl: './table.component.html',
  imports: [CommonModule, FormsModule],
})
export class TableData implements OnInit {
  @Output() showAddForm = new EventEmitter<boolean>();
  @Output() editRow = new EventEmitter<TableRow>();
  data: TableRow[] = [];
  filteredRows: TableRow[] = [];
  editing: TableRow | null = null;
  isAdding: boolean = false;

  // Phân trang
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;

  filters: Filters = {
    voucherNo: '',
    voucherDate: '',
    code: '',
    name: '',
    assetFixedId: 0,
  };

  constructor(private tableDataService: TableDataService) {} // Bỏ Router

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tableDataService.getData(this.pageIndex, this.pageSize).subscribe(
      (response) => {
        // Kiểm tra và lấy mảng content từ response
        if (Array.isArray(response.content)) {
          this.data = response.content;

          this.totalPages = response.totalPages;

          this.filteredRows = [];
          this.filteredRows = this.data;
        } else {
          console.error('Dữ liệu không có mảng content:', response);
        }
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu từ backend:', error);
      }
    );
  }

  applyFilters() : void {
    this.filteredRows = this.data.filter((row) => {
      return (
        (!this.filters.voucherNo ||
          row.voucherCode.toLowerCase().includes(this.filters.voucherNo.toLowerCase())) &&
        (!this.filters.voucherDate || row.voucherDate === this.filters.voucherDate) &&
        (!this.filters.code || row.code.toLowerCase().includes(this.filters.code.toLowerCase())) &&
        (!this.filters.name || row.name.toLowerCase().includes(this.filters.name.toLowerCase()))
      );
    });
    this.pageIndex = 1;
  }

  // Xóa bộ lọc
  clearFilters(): void {
    this.filters = {
      voucherNo: '',
      voucherDate: '',
      code: '',
      name: '',
      assetFixedId: 0,
    };
    this.applyFilters();
  }
  startAdd() : void {
    this.showAddForm.emit(true);
  }

  onEdit(row: TableRow) {
    this.editRow.emit(row);
  }

  // Xóa dòng
  deleteRow(asserFixedId: number): void {
    console.log(asserFixedId);
    this.tableDataService.deleteRow(asserFixedId).subscribe(
      (response) => {
        console.log('Xóa thành công:', response);

        this.loadData();
      },
      (error) => {
        console.error('Lỗi khi xóa:', error);
      }
    );
  }

  pagedRows() : TableRow[] {
    const start = 0;
    const end = this.pageSize;
    return this.filteredRows.slice(start, end)
  }

  pages() : number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(0, this.pageIndex - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.pageIndex = 0;
    this.loadData();
  }

  goFirst(): void {
    this.pageIndex = 0;
    this.loadData();
  }

  goLast(): void {
    this.pageIndex = this.totalPages - 1;
    this.loadData();
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
    }
    this.loadData();
  }

  goPage(page: number): void {
    this.pageIndex = page;
    this.loadData();
  }
}
