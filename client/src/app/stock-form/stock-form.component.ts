import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { IStock } from '../model/stock';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../services/stock.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css'],
})
export class StockFormComponent {
  faClose = faClose;
  processing = false;
  stockForm!: FormGroup;

  @Input()
  stock?: IStock;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly stockService: StockService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.stock) {
      this.stockForm = new FormGroup({
        name: new FormControl(this.stock.name, [Validators.required]),
      });
    } else {
      this.stockForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
    }
  }

  close() {
    this.activeModal.close(null);
  }

  save() {
    if (this.stock) {
      this.updateStock();
    } else {
      this.createStock();
    }
  }

  createStock() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('creating...', '', { timeOut: 0 });
    const stock: IStock = {
      name: this.stockForm.controls['name'].value,
      quantity: 0,
    };

    this.stockService.createStock(stock).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.success) {
          this.activeModal.close(response.data);
          this.toastr.success('Created');
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.processing = false;
        this.toastr.clear();
        this.toastr.warning(err.error);
      },
    });
  }

  updateStock() {
    if (this.processing) return;

    this.toastr.info('saving...', '', { timeOut: 0 });
    this.processing = true;
    const stock: IStock = {
      id: this.stock?.id,
      name: this.stockForm.controls['name'].value,
    };

    this.stockService.updateStock(stock).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.activeModal.close(response.data);
          this.toastr.success('Saved');
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.toastr.clear();
        this.processing = false;
        this.toastr.warning(err.message);
      },
    });
  }
}
