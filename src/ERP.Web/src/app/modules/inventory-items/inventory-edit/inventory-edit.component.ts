import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EmployeeService } from 'src/app/modules/employees/shared/employee.service';
import { InventoryItemService } from '../shared/inventory-item-service';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.scss']
})
export class InventoryEditComponent implements OnInit {
  id:string="";
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
    private route: ActivatedRoute,
    private inventoryItemService: InventoryItemService,
    private loaderService: LoaderService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.id= this.route.snapshot.paramMap.get('id')!;
    if (this.id == null) {
      this.goToList();
    } else {
      this.getIventoryItemDetails();
    }
  }
    getIventoryItemDetails() {
      var req = {
        id: this.id
      };
    this.inventoryItemService.geInventoryItemById(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            this.InventoryItem = value.data.name;
            this.Description = value.data.description;
            this.Price = value.data.price;
            this.Quantity = value.data.quantity;
          }
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
      id:this.id,
      name: this.InventoryItem,
      description:this.Description,
      quantity: this.Quantity,
      price: this.Price,
    }
    this.inventoryItemService.updateInventoryItem(req)
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
