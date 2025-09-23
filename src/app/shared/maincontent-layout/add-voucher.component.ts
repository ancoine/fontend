import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownDataService,DropdownItem } from '../../services/addvoucher-data.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddVoucherComponent implements OnInit {
  @Output() showAddForm = new EventEmitter<boolean>();

  voucherForm: FormGroup;
  
  // Dữ liệu dropdown
  assets: DropdownItem[] = [];
  processingMethods: DropdownItem[] = [];
  decreaseReasons: DropdownItem[] = [];
  processingCosts: DropdownItem[] = [];
  
  // Loading states
  loadingAll = false;
  loadingAssets = false;
  loadingProcessingMethods = false;
  loadingDecreaseReasons = false;
  loadingProcessingCosts = false;

  // Error states
  hasError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dropdownService: DropdownDataService
  ) {
    this.voucherForm = this.fb.group({
      assetFixedId: ['', Validators.required],
      employeeId: [''],
      voucherDate: ['', Validators.required],
      voucherNumber: ['', Validators.required],
      voucherNo: [''],
      decisionNo: [''],
      decisionDate: ['', Validators.required],
      invoiceNo: [''],
      invoiceDate: [''],
      type: ['', Validators.required],
      decRev: [''],
      depAccPaid: [''],
      depAccUnpaid: [''],
      assetProcCost: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadAllDropdownData();
    
  }

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.voucherForm.patchValue({
      voucherDate: today,
      decisionDate: today,
      invoiceDate: today
    });
  }

  // Load tất cả dữ liệu dropdown song song (nhanh hơn)
  loadAllDropdownData(): void {
    this.loadingAll = true;
    this.hasError = false;

    forkJoin({
      assets: this.dropdownService.getAssets().pipe(
        catchError(error => {
          console.error('Lỗi khi tải danh sách tài sản:', error);
          return of([]);
        })
      ),
      processingMethods: this.dropdownService.getProcessingMethods().pipe(
        catchError(error => {
          console.error('Lỗi khi tải danh sách hình thức xử lý:', error);
          return of([]);
        })
      ),
      decreaseReasons: this.dropdownService.getDecreaseReasons().pipe(
        catchError(error => {
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
      }
    });
  }

  // Load từng loại riêng lẻ (backup method)
  loadAssets(): void {
    this.loadingAssets = true;
    this.dropdownService.getAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
        this.loadingAssets = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách tài sản:', error);
        this.loadingAssets = false;
      }
    });
  }

  loadProcessingMethods(): void {
    this.loadingProcessingMethods = true;
    this.dropdownService.getProcessingMethods().subscribe({
      next: (methods) => {
        this.processingMethods = methods;
        this.loadingProcessingMethods = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách hình thức xử lý:', error);
        this.loadingProcessingMethods = false;
      }
    });
  }

  loadDecreaseReasons(): void {
    this.loadingDecreaseReasons = true;
    this.dropdownService.getDecreaseReasons().subscribe({
      next: (reasons) => {
        this.decreaseReasons = reasons;
        this.loadingDecreaseReasons = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách lý do giảm:', error);
        this.loadingDecreaseReasons = false;
      }
    });
  }

  // loadProcessingCosts(): void {
  //   this.loadingProcessingCosts = true;
  //   this.dropdownService.getProcessingCosts().subscribe({
  //     next: (costs) => {
  //       this.processingCosts = costs;
  //       this.loadingProcessingCosts = false;
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi tải danh sách chi phí xử lý:', error);
  //       this.loadingProcessingCosts = false;
  //     }
  //   });
  // }

  // Retry loading data
  retryLoadData(): void {
    this.loadAllDropdownData();
  }

  onSubmit(): void {
    if (this.voucherForm.valid) {
      const formData = this.voucherForm.value;
      console.log('Form data:', formData);
      
      // TODO: Gọi service để lưu dữ liệu
      this.showAddForm.emit(false);
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.voucherForm.controls).forEach(key => {
      const control = this.voucherForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.showAddForm.emit(false);
  }
}