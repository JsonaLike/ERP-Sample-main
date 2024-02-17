import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionEnum } from 'src/app/shared/enums/permission.enum';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { VendorListComponent } from './Vendor-list/vendor-list.component';
import { VendorAddComponent } from './Vendor-add/vendor-add.component';
import { VendorEditComponent } from './Vendor-edit/vendor-edit.component';
import { VendorViewComponent } from './Vendor-view/vendor-view.component';

const routes: Routes = [{
  path: "list",
  component: VendorListComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeView }
}, {
  path: "add",
  component: VendorAddComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeAdd }
}, {
  path: "edit/:id",
  component: VendorEditComponent,
  canActivate: [PermissionGuard],
  data: { permission: PermissionEnum.EmployeeEdit }
}, {
  path: "view/:id",
  component: VendorViewComponent,
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
export class VendorsRoutingModule { }
