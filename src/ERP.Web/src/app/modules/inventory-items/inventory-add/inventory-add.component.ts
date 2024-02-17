import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EmployeeService } from 'src/app/modules/employees/shared/employee.service';
import { InventoryItemService } from '../shared/inventory-item-service';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss']
})
export class InventoryAddComponent implements OnInit {

  InventoryItem: string = "";
  Description!: string;
  Price!: number;
  Quantity!: number;
  InventoryValue!: number;
  Discounted: number = 0;
  parmenantAddress: string | null = null;
  currentAddress: string | null = null;
  isCurrentSameAsParmenantAddress: boolean = false;
  personalEmailId: string | null = null;
  personalMobileNo: string | null = null;
  otherContactNo: string | null = null;
  joiningOn: any = new Date();
  today: any = new Date();

  constructor(private router: Router,
    private inventoryItemService: InventoryItemService,
    private loaderService: LoaderService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  goToList() {
    this.router.navigateByUrl("/app/inventory/list");
  }

  onClearClick(form: NgForm) {
    this.InventoryItem = "";
    this.Description = "";
    /*this.middleName ;*/
    this.parmenantAddress = null;
    this.currentAddress = null;
    this.personalEmailId = null;
    this.personalMobileNo = null;
    this.otherContactNo = null;

    form.resetForm();
    this.joiningOn = new Date();
    this.Discounted = 0;
    this.isCurrentSameAsParmenantAddress = false;
  }

  onChangeSameAsAddress() {
    if (this.isCurrentSameAsParmenantAddress) {
      this.currentAddress = null;
    }
  }

  onSubmit() {
    this.loaderService.showLoader();
    var req = {
      name: this.InventoryItem,
      description:this.Description,
      quantity: this.Quantity,
      price: this.Price,
    }
    this.inventoryItemService.createInventoryItem(req)
      .subscribe({
        next: (value: any) => {
          if (value && value.isValid) {
            this.messageService.add({ severity: 'success', detail: value.successMessages[0] });
            this.goToList();
          } else {
            this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
          }
        }, error: (error: any) => {
          this.messageService.add({ severity: 'error', detail: error.message });
          this.loaderService.hideLoader();
        }, complete: () => {
          this.loaderService.hideLoader();
        }
      });
  }
}
