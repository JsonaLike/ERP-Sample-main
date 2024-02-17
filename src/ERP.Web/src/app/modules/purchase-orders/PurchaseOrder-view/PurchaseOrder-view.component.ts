import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PurchaseOrderService } from '../shared/PurchaseOrder-service';
import { VendorService } from '../../vendors/shared/vendor-service';
import { InventoryItem, PoInventoryItemDto } from '../shared/data';
import { InventoryItemService } from '../../inventory-items/shared/inventory-item-service';

@Component({
  selector: 'app-PurchaseOrder-view',
  templateUrl: './PurchaseOrder-view.component.html',
  styleUrls: ['./PurchaseOrder-view.component.scss']
})
export class PurchaseOrderViewComponent implements OnInit {
  id: string = "";
  PurchaseOrderNumber: string = "";
  Notes!: string;
  shippingAddress!: number;
  Quantity!: number;
  InventoryValue!: number;
  Discounted: number = 0;
  parmenantAddress: string | null = null;
  currentAddress: string | null = null;
  isCurrentSameAsParmenantAddress: boolean = false;
  personalEmailId: string | null = null;
  personalMobileNo: string | null = null;
  otherContactNo: string | null = null;
  date!: Date;
  Items: InventoryItem[] = [];
  SelectedPurchaseOrderItems: (PoInventoryItemDto | undefined)[] = [];
  joiningOn: any = new Date();
  today: any = new Date();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private PurchaseOrderService: PurchaseOrderService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private inventoryItemService: InventoryItemService,
    private vendorService: VendorService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id == null) {
      this.goToList();
    } else {

      this.getVendorDetails();
    }
  }
  getVendorDetails() {
    var req = {
      id: this.id
    };
    this.PurchaseOrderService.getPurchaseOrderById(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            this.PurchaseOrderNumber = value.data.purchaseOrderNumber;
            this.Notes = value.data.notes;
            this.shippingAddress = value.data.shippingAddress;
            this.Quantity = value.data.quantity;
            this.date = value.data.purchaseOrderDate;


            this.inventoryItemService.getAllInventoryItems(req).subscribe({
              next: (value: any) => {
                if (value && value.isValid) {
                  if (value.data) {
                    this.Items = value.data.inventoryItems;
                    this.PurchaseOrderService.getAllPurchaseOrderItems(req).subscribe({
                      next: (value: any) => {
                        if (value.data.purchaseOrdersItems.length != 0) {
                          this.SelectedPurchaseOrderItems = this.Items.filter(x => value.data.purchaseOrdersItems.some((y: any) => y.itemId == x.id));
                          value.data.purchaseOrdersItems.forEach((item: any) => {
                            var ItemfromItems = this.Items.filter(x => x.id == item?.itemId)[0];
                            ItemfromItems.price = item!.price;
                            ItemfromItems.quantity = item!.quantity;
                          });
                        }
                      }
                    });
                  }
                }
              }
            });


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
    this.router.navigateByUrl("/app/purchase-orders/list");
  }

  onDropdownChange(event: any, i: number) {//here where we add the new item to the list
    var row = document.getElementById('POI' + i);

    var ItemCell = row!.querySelector('.dropdownp');
    if (this.SelectedPurchaseOrderItems.filter((el) => { return el?.id == event.value.id }).length == 2) {
      this.showToast1();
      //this.SelectedPurchaseOrderItems[i]=structuredClone(this.SelectedPurchaseOrderItems[i])
      this.SelectedPurchaseOrderItems.splice(i, 1);
      row?.remove();
    }
    else {
      this.SelectedPurchaseOrderItems[i] = structuredClone(this.SelectedPurchaseOrderItems[i])
    }
  }

  showToast1() {
    this.messageService.clear();
    this.messageService.add({ key: 'toast1', severity: 'warn', summary: 'Failed', detail: 'Can\'t add Item that has been already added.' });
  }

  onPriceChange(event: any, i: number, Element: any) {
    var row = document.getElementById('POI' + i);
    var PriceCell = row!.querySelector('.Price') as HTMLInputElement;
    Element.price = Number(PriceCell.value);
  }

  AddNewItem() {
    let result = this.Items.filter(o1 => !this.SelectedPurchaseOrderItems.some(o2 => o1.id === o2?.id));
    this.SelectedPurchaseOrderItems.push(undefined)
  }


  onClearClick(form: NgForm) {
    this.PurchaseOrderNumber = "";
    this.Notes = "";
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
    this.goToList();
  }
}
