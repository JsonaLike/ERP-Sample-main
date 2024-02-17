import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EmployeeService } from 'src/app/modules/employees/shared/employee.service';
import { VendorService } from '../shared/vendor-service';

@Component({
  selector: 'app-vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.scss']
})
export class VendorViewComponent implements OnInit {
  id:string="";
  vendorName: string = "";
  vendorAddress!: string;
  Price!: number;
  Quantity!: number;
  InventoryValue!: number;
  City!:string;
  ZipCode!:string;
  Country!:string;
  Phone!:string;
  ContactName!:string;
  ContactNotes:string|null=null;
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
    private VendorService: VendorService,
    private loaderService: LoaderService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.id= this.route.snapshot.paramMap.get('id')!;
    if (this.id == null) {
      this.goToList();
    } else {
      this.getVendors();
    }
  }
    getVendors() {
      var req = {
        id: this.id
      };
    this.VendorService.getVendorById(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            this.vendorName = value.data.vendorName;
            this.vendorAddress = value.data.vendorAddress;
            this.Price = value.data.price;
            this.Quantity = value.data.quantity;
            this.City = value.data.vendorCity;
            this.ZipCode = value.data.vendorZipCode;
            this.Country = value.data.vendorCountry;
            this.Phone = value.data.vendorPhone;
            this.ContactName = value.data.contactName;
            this.ContactNotes = value.data.contactNotes;
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
    this.router.navigateByUrl("/app/vendors/list");
  }

  onClearClick(form: NgForm) {
    this.vendorName = "";
    this.vendorAddress = "";
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
