import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './Inventory-routing.module';
import { EmployeeService } from 'src/app/modules/employees/shared/employee.service';
import { DesignationService } from 'src/app/modules/designations/shared/designation.service';
import { DepartmentService } from 'src/app/modules/departments/shared/department.service';
import { EmployeeEducationModule } from '../employee-education/employee-education.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryAddComponent } from './inventory-add/inventory-add.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryAddComponent,
    InventoryEditComponent,
    InventoryViewComponent
  ],
  imports: [
    EmployeesRoutingModule,
    EmployeeEducationModule,
    SharedModule
  ],
  providers: [
    EmployeeService,
    DesignationService,
    DepartmentService
  ]
})
export class InventoryModule { }
