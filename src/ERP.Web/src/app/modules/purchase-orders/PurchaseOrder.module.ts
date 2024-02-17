import { NgModule } from '@angular/core';
import { PurchaseOrderAddComponent } from './PurchaseOrder-add/PurchaseOrder-add.component';
import { PurchaseOrderListComponent } from './PurchaseOrder-list/PurchaseOrder-list.component';
import { PurchaseOrderEditComponent } from './PurchaseOrder-edit/PurchaseOrder-edit.component';
import { PurchaseOrderRoutingModule } from './PurchaseOrder-routing.module';
import { PurchaseOrderService } from './shared/PurchaseOrder-service';
import { DesignationService } from '../designations/shared/designation.service';
import { DepartmentService } from '../departments/shared/department.service';
import { PurchaseOrderViewComponent } from './PurchaseOrder-view/PurchaseOrder-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderAddComponent,
    PurchaseOrderEditComponent,
    PurchaseOrderViewComponent
  ],
  imports: [
    PurchaseOrderRoutingModule,
    SharedModule,
    DropdownModule,
    NgSelectModule,

  ],
  providers: [
    PurchaseOrderService,
    DesignationService,
    DepartmentService,
    DatePipe
  ]
})
export class PurchaseOrderModule { }
