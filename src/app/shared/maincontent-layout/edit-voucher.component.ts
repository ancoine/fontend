import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableDataService } from '../../services/table-date.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownDataService, DropdownItem } from '../../services/addvoucher-data.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableRow } from '../../response/TableRow';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit.voucher.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditVoucherForm implements OnInit {
  @Input() row!: TableRow | null;
  @Output() closeForm = new EventEmitter<void>();

  editVoucherForm!: FormGroup;
  selectedId: number | null = null;
  showEdit = false;

  // Dữ liệu dropdown
  assets: DropdownItem[] = [];
  processingMethods: DropdownItem[] = [];
  decreaseReasons: DropdownItem[] = [];

  // Loading states
  loadingAll = false;
  hasError = false;
  errorMessage = '';

  constructor(
    private tableService: TableDataService,
    private fb: FormBuilder,
    private dropdownService: DropdownDataService
  ) {}

  ngOnInit(): void {
  // Khởi tạo form trước
  this.editVoucherForm = this.fb.group({
    assetFixedId: [''],
    employeeId: [''],
    voucherDate: [''],
    voucherNo: [''],
    decisionNo: [''],
    decisionDate: [''],
    type: [''],
    invoiceNo: [''],
    invoiceDate: [''],
    reasonId: [''],
    decRev: [''],
    depAccPaid: [''],
    depAccUnpaid: [''],
    assetProcCost: [''],
    description: [''],
  });

  // Nếu có row (chỉ chứa id, voucherNo, ... ít field) thì gọi backend
  if (this.row && this.row.assetFixedId) {
    this.loadVoucherDetail(this.row.assetFixedId);
  }

  this.loadAllDropdownData();
}
ngOnChanges(): void {
  if (this.row && this.row.assetFixedId) {
    this.selectedId = this.row.assetFixedId; // gán ngay
    this.loadVoucherDetail(this.row.assetFixedId);
  }
}


// Hàm gọi API backend để lấy full dữ liệu
private loadVoucherDetail(id: number): void {
  this.tableService.getById(id).subscribe({
    next: (data) => {
      console.log('👉 Full dữ liệu backend:', data);
      this.selectedId = id;
      this.editVoucherForm.patchValue(data); // patchValue toàn bộ field
    },
    error: (err) => {
      console.error('❌ Lỗi khi lấy chi tiết:', err);
    },
  });
}


  onEdit(row: any): void {
    this.tableService.getById(row.id).subscribe({
      next: (data) => {
        console.log('👉 Dữ liệu backend trả về:', data);
        this.selectedId = row.id;
        this.editVoucherForm.patchValue(data);
        this.showEdit = true;
      },
      error: (err) => console.error('❌ Lỗi khi lấy chi tiết:', err),
    });
  }

 save(): void {
  if (this.selectedId) {
    // Chuyển assetFixedId, type, reasonId về đúng dạng object/number
    const payload = {
  ...this.editVoucherForm.value,
  type: Number(this.editVoucherForm.value.type),
  reasonId: Number(this.editVoucherForm.value.reasonId),
  employeeId: this.editVoucherForm.value.employeeId ? Number(this.editVoucherForm.value.employeeId) : null,
  decRev: Number(this.editVoucherForm.value.decRev),
  depAccPaid: Number(this.editVoucherForm.value.depAccPaid),
  depAccUnpaid: Number(this.editVoucherForm.value.depAccUnpaid),
  assetProcCost: Number(this.editVoucherForm.value.assetProcCost),
  
};

    console.log('Payload gửi lên backend:', payload);

    this.tableService.updateRow(this.selectedId, payload)
      .subscribe({
        next: (res) => {
          console.log('✅ Cập nhật thành công:', res);
          this.closeForm.emit();
        },
        error: (err) => console.error('❌ Lỗi khi cập nhật:', err),
      });
  }
}



  cancel(): void {
    this.closeForm.emit();
  }

  loadAllDropdownData(): void {
    this.loadingAll = true;
    this.hasError = false;

    forkJoin({
      assets: this.dropdownService.getAssets().pipe(
        catchError((error) => {
          console.error('Lỗi khi tải danh sách tài sản:', error);
          return of([]);
        })
      ),
      processingMethods: this.dropdownService.getProcessingMethods().pipe(
        catchError((error) => {
          console.error('Lỗi khi tải danh sách hình thức xử lý:', error);
          return of([]);
        })
      ),
      decreaseReasons: this.dropdownService.getDecreaseReasons().pipe(
        catchError((error) => {
          console.error('Lỗi khi tải danh sách lý do giảm:', error);
          return of([]);
        })
      ),
    }).subscribe({
      next: (data) => {
        this.assets = data.assets;
        this.processingMethods = data.processingMethods;
        this.decreaseReasons = data.decreaseReasons;
        this.loadingAll = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu dropdown:', error);
        this.hasError = true;
        this.errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại.';
        this.loadingAll = false;
      },
    });
  }
}
