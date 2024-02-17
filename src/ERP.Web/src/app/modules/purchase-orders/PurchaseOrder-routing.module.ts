import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionEnum } from 'src/app/shared/enums/permission.enum';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { PurchaseOrderListComponent } from './PurchaseOrder-list/PurchaseOrder-list.component';
import { PurchaseOrderAddComponent } from './PurchaseOrder-add/PurchaseOrder-add.component';
import { PurchaseOrderEditComponent } from './PurchaseOrder-edit/PurchaseOrder-edit.component';
import { PurchaseOrderViewComponent } from './PurchaseOrder-view/PurchaseOrder-view.component';

const routes: Routes = [{
  path: "list",
  component: PurchaseOrderListComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.UserView }
}, {
  path: "add",
  component: PurchaseOrderAddComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.UserAdd }
}, {
  path: "edit/:id",
  component: PurchaseOrderEditComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.UserEdit }
}, {
  path: "view/:id",
  component: PurchaseOrderViewComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.UserView }
}, {
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
