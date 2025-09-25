import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownDataService, DropdownItem } from '../../services/addvoucher-data.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableDataService } from '../../services/table-date.service';
@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddVoucherComponent implements OnInit {
  @Output() showAddForm = new EventEmitter<boolean>();
  loadingSubmit: boolean = false;
  
  voucherForm: FormGroup;

  // Dữ liệu dropdown
  assets: DropdownItem[] = [];
  processingMethods: DropdownItem[] = [];
  decreaseReasons: DropdownItem[] = [];
 

  // Loading states
  loadingAll = false;
  loadingAssets = false;
  loadingProcessingMethods = false;
  loadingDecreaseReasons = false;
 

  // Error states
  hasError = false;
  errorMessage = '';

  constructor(
    private tableDataService: TableDataService,
    private fb: FormBuilder,
    private dropdownService: DropdownDataService
  ) {
    this.voucherForm = this.fb.group({
      assetFixedId: ['', Validators.required],
      employeeId: [''],
      voucherDate: ['', Validators.required],
      voucherNo: ['', Validators.required],
      decisionNo: [''],
      decisionDate: ['', Validators.required],
      invoiceNo: [''],
      invoiceDate: [''],
      reasonId: [''],
      type: ['', Validators.required],
      decRev: [''],
      depAccPaid: [''],
      depAccUnpaid: [''],
      assetProcCost: [''],

      description: [''],
    });
  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadAllDropdownData()
  }

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.voucherForm.patchValue({
      voucherDate: today,
      decisionDate: today,
      invoiceDate: today,
    });
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
      )
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



  retryLoadData(): void {
    this.loadAllDropdownData();
  }

  onSubmit(): void {
    if (this.voucherForm.valid && !this.loadingSubmit) {
      this.loadingSubmit = true;
      const formData = this.voucherForm.value;
      console.log('Form data:', formData);

      this.tableDataService.addNewRow(formData).subscribe({
        next: (response) => {
          console.log('Thêm dữ liệu thành công:', response);
          this.showAddForm.emit(false);
          this.loadingSubmit = false;
        },
        error: (error) => {
          if (error.status === 201) {
            console.log('Thêm dữ liệu thành công (status 201)');
            this.showAddForm.emit(false);
          } else {
            console.error('Lỗi thực sự:', error.status, error.message);
          }
          this.loadingSubmit = false;
        },
        complete: () => {
          console.log('Hoàn thành thêm dữ liệu');
          this.loadingSubmit = false;
        },
      });
    } else {
      console.log('Form không hợp lệ');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.voucherForm.controls).forEach((key) => {
      const control = this.voucherForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.showAddForm.emit(false);
  }
}
