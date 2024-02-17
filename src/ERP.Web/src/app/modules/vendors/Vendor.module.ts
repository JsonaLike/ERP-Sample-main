import { NgModule } from '@angular/core';
import { VendorsRoutingModule } from './Vendor-routing.module';
import { EmployeeService } from 'src/app/modules/employees/shared/employee.service';
import { DesignationService } from 'src/app/modules/designations/shared/designation.service';
import { DepartmentService } from 'src/app/modules/departments/shared/department.service';
import { EmployeeEducationModule } from '../employee-education/employee-education.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VendorListComponent } from './Vendor-list/vendor-list.component';
import { VendorAddComponent } from './Vendor-add/vendor-add.component';
import { VendorEditComponent } from './Vendor-edit/vendor-edit.component';
import { VendorViewComponent } from './Vendor-view/vendor-view.component';
import { VendorService } from './shared/vendor-service';

@NgModule({
  declarations: [
    VendorListComponent,
    VendorAddComponent,
    VendorEditComponent,
    VendorViewComponent
  ],
  imports: [
    VendorsRoutingModule,
    SharedModule
  ],
  providers: [
    VendorService,
    DesignationService,
    DepartmentService
  ]
})
export class VendorModule { }
