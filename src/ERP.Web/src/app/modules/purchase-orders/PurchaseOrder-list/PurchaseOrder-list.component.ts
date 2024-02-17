import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PermissionEnum } from 'src/app/shared/enums/permission.enum';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PurchaseOrderService } from '../shared/PurchaseOrder-service';
import { PurchaseOrderStatus } from 'src/app/shared/enums/PurchaseOrderStatus.enum';

@Component({
  selector: 'app-PurchaseOrder-list',
  templateUrl: './PurchaseOrder-list.component.html',
  styleUrls: ['./PurchaseOrder-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {

  PurchaseOrders!: any[];
  searchKeyword: string = "";
  totalRecords!: number;
  searchTimeout: any = undefined;

  canAdd: boolean = false;
  canEdit: boolean = false;

  constructor(private PurchaseOrderService: PurchaseOrderService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private permissionService: PermissionService,
    private router: Router) { }

  ngOnInit(): void {
    this.canAdd = this.permissionService.hasPermission(PermissionEnum.PurchaseOrderAdd);
    this.canEdit = this.permissionService.hasPermission(PermissionEnum.PurchaseOrderEdit);

    this.search({ page: 0, rows: 10 });
  }

  onChangeSearchKeyword() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.search({ page: 0, rows: 10 });
    }, 1500);
    
  }
GetPurchaseOrderStatus(status :number){
    return PurchaseOrderStatus[status];
}
  search(event: any) {
    this.loaderService.showLoader();
    var req = {
      searchKeyword: this.searchKeyword,
      pageIndex: event.page,
      pageSize: event.rows
    };
    this.PurchaseOrderService.getAllPurchaseOrders(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            console.log(value);
            this.PurchaseOrders = value.data.purchaseOrders;
            this.totalRecords = value.data.count;
            console.log(this.PurchaseOrders);
            
          }
        } else {
          this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
        }
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', detail: error.message });
        this.loaderService.hideLoader();
      }, complete: () => {
        this.loaderService.hideLoader();
      }
    });
  }

  goToAdd() {
    this.router.navigateByUrl("/app/purchase-orders/add");
  }

  clearSearch() {
    this.searchKeyword = "";
    this.search({ page: 0, rows: 10 });
  }
}
