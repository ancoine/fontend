import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../../services/table-date.service'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'table-data',
  templateUrl: './table.component.html',
  imports: [CommonModule],
})
export class TableData implements OnInit {

  data: any[] = [];

  constructor(private tableDataService: TableDataService) { }

  ngOnInit(): void {
    // Gọi phương thức getData từ service để lấy dữ liệu từ backend
    this.tableDataService.getData().subscribe(
      (response) => {
        this.data = response;  // Lưu dữ liệu trả về từ backend vào biến data
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu từ backend:', error);
      }
    );
  }

  // Thêm mới dòng
  addNewRow() {
    const newRow = { 
      stt: 1007, 
      maCT: '1007', 
      ngayCT: '2025-09-21', 
      maTscd: '1007', 
      tenTscd: '[PC&KSNBL]Thông báo điểm mới quan trọng của Luật Đấu thầu 2023 và các văn bản hướng dẫn liên quan', 
      highlight: false 
    };
    this.tableDataService.addNewRow(newRow).subscribe(
      () => {
        this.data.push(newRow);  // Thêm dòng vào bảng sau khi thêm thành công
      },
      (error) => {
        console.error('Có lỗi xảy ra khi thêm dòng:', error);
      }
    );
  }

  // Sửa dòng
  editRow(index: number) {
    const updatedRow = { 
      ...this.data[index], 
      tenTscd: 'Sửa thông tin' // Ví dụ sửa tên TSCD
    };
    this.tableDataService.editRow(index, updatedRow).subscribe(
      () => {
        this.data[index] = updatedRow;  // Cập nhật lại dữ liệu bảng
      },
      (error) => {
        console.error('Có lỗi xảy ra khi sửa dòng:', error);
      }
    );
  }

  // Xóa dòng
  deleteRow(index: number) {
    this.tableDataService.deleteRow(index).subscribe(
      () => {
        this.data.splice(index, 1);  // Xóa dòng khỏi bảng
      },
      (error) => {
        console.error('Có lỗi xảy ra khi xóa dòng:', error);
      }
    );
  }
}
