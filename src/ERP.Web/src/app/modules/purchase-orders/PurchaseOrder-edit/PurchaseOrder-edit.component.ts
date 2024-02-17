import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PurchaseOrderService } from '../shared/PurchaseOrder-service';
import { InventoryItem, PoInventoryItemDto } from '../shared/data';
import { VendorService } from '../../vendors/shared/vendor-service';
import { InventoryItemService } from '../../inventory-items/shared/inventory-item-service';
import { PurchaseOrderStatus } from 'src/app/shared/enums/PurchaseOrderStatus.enum';

@Component({
  selector: 'app-PurchaseOrder-edit',
  templateUrl: './PurchaseOrder-edit.component.html',
  styleUrls: ['./PurchaseOrder-edit.component.scss']
})
export class PurchaseOrderEditComponent implements OnInit {
  @ViewChild('PurchaseOrderForm', { static: false }) purchaseOrderForm!: NgForm;
  Id: string = "";
  PurchaseOrderNumber: string = "";
  ShippingAddress!: string;
  Notes: string = "";
  Discounted: number = 0;
  Vendors!: any[];
  SelectedVendor: any = PurchaseOrderStatus;
  Items: InventoryItem[] = [];
  SelectedItem!: any;
  SelectedPurchaseOrderItems: (PoInventoryItemDto | undefined)[] = [];
  SelectedStatus!: any;
  date!: Date;
  POS!: any[];
  parmenantAddress: string | null = null;
  currentAddress: string | null = null;
  isCurrentSameAsParmenantAddress: boolean = false;
  personalEmailId: string | null = null;
  personalMobileNo: string | null = null;
  otherContactNo: string | null = null;
  joiningOn: any = new Date();
  constructor(private router: Router,
    private PurchaseOrderService: PurchaseOrderService,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private inventoryItemService: InventoryItemService,
    private activatedRoute: ActivatedRoute
  ) { }

  AddNewItem() {
    let result = this.Items.filter(o1 => !this.SelectedPurchaseOrderItems.some(o2 => o1.id === o2?.id));
    this.SelectedPurchaseOrderItems.push(undefined)
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

  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.params['id'];
    this.POS = Object.values(PurchaseOrderStatus).map(value => ({ key: PurchaseOrderStatus[Number(value)], value: value }));
    this.POS = this.POS.filter(x => typeof (x.key) !== 'undefined');
    var req = {
    };
    this.vendorService.getAllVendors(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            this.Vendors = value.data.vendors;
            this.inventoryItemService.getAllInventoryItems(req).subscribe({
              next: (value: any) => {
                if (value && value.isValid) {
                  if (value.data) {
                    this.Items = value.data.inventoryItems;
                    let item1 = { ...this.Items[0] };
                    item1.quantity = 1;
                    this.Items[0].quantity = 1;

                    this.SelectedPurchaseOrderItems = [
                      undefined,
                    ];
                    req = {
                      Id: this.Id
                    }
                    this.PurchaseOrderService.getPurchaseOrderById(req).subscribe({
                      next: (value: any) => {
                        if (value && value.isValid) {
                          if (value.data) {
                            this.PurchaseOrderNumber = value.data.purchaseOrderNumber;
                            this.date = new Date(Date.parse(value.data.purchaseOrderDate));
                            this.ShippingAddress = value.data.shippingAddress;
                            this.Notes = value.data.notes;
                            this.SelectedVendor = this.Vendors.filter(x => x.id == value.data.vendorId)[0];
                            this.SelectedStatus = this.POS.filter(x => x.value == value.data.status)[0];
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
                        } else {
                          this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
                        }
                      }
                    });
                  }
                } else {
                  this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
                }
              }
            });

          }
        } else {
          this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
        }
      }
    }
    );


  }
  isNumeric(value: any) {
    return /^-?\d+$/.test(value);
  }
  goToList() {
    this.router.navigateByUrl("/app/purchase-orders/list");
  }

  onClearClick(form: NgForm) {
    this.PurchaseOrderNumber = "";
    this.ShippingAddress = "";
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
    var selectedItems = structuredClone(this.SelectedPurchaseOrderItems);
    var PurchaseOrderItems = selectedItems
      .filter((item: any) => item && item.id && item.quantity && item.price) // Filter out items that are empty or have missing fields
      .map((item: any) => ({
        inventoryItemId: item.id,
        quantity: item.quantity,
        price: item.price
      }));
    //selectedItems = selectedItems.filter((e:InventoryItem)=>{return e!=undefined});
    console.log(this.SelectedStatus);

    var req = {
      Id: this.Id,
      PurchaseOrderDate: this.date,
      vendorId: this.SelectedVendor.id,
      PurchaseOrderNumber: this.PurchaseOrderNumber,
      shippingAddress: this.ShippingAddress,
      purchaseOrderItems: PurchaseOrderItems,
      PurchaserOrderStatus: Number(this.SelectedStatus.value),
      PurchaserOrderNotes: this.Notes

    }
    this.PurchaseOrderService.updatePurchaseOrder(req)
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
