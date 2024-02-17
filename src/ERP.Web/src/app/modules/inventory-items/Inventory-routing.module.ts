import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionEnum } from 'src/app/shared/enums/permission.enum';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { InventoryAddComponent } from './inventory-add/inventory-add.component';

const routes: Routes = [{
  path: "list",
  component: InventoryListComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeView }
}, {
  path: "add",
  component: InventoryAddComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeAdd }
}, {
  path: "edit/:id",
  component: InventoryEditComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeEdit }
}, {
  path: "view/:id",
  component: InventoryViewComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeView }
}, {
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
