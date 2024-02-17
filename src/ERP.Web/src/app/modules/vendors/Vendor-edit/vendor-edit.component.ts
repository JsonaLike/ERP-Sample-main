import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { VendorService } from '../shared/vendor-service';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.scss']
})
export class VendorEditComponent implements OnInit {
  id:string="";
  Vendor: string = "";
  Description!: string;
  Price!: number;
  Quantity!: number;
  Email!:string;
  City!:string;
  vendorAddress!:string;
  vendorCountry!:string;
  ZipCode!:string;
  InventoryValue!: number;
  contactName!:string;
  contactNotes:string|null=null;
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
      this.getIventoryItemDetails();
    }
  }
    getIventoryItemDetails() {
      var req = {
        id: this.id
      };
    this.VendorService.getVendorById(req).subscribe({
      next: (value: any) => {
        if (value && value.isValid) {
          if (value.data) {
            this.Vendor = value.data.vendorName;
            this.Description = value.data.description;
            this.Price = value.data.price;
            this.City = value.data.vendorCity;
            this.Quantity = value.data.quantity;
            this.vendorAddress = value.data.vendorAddress;
            this.vendorCountry = value.data.vendorCountry;
            this.ZipCode= value.data.vendorZipCode;
            this.Email=value.data.vendorEmail;
            this.contactName = value.data.contactName;
            this.contactNotes= value.data.contactNotes
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
    this.Vendor = "";
    this.Description = "";
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
    var req = {
      Id:this.id,
      vendorName: this.Vendor,
      vendorAddress:this.vendorAddress,
      vendorCity: this.City,
      vendorZipCode: this.ZipCode,
      vendorCountry: this.vendorCountry,
      vendorPhone: this.vendorCountry,
      vendorEmail: this.Email,
      contactName: this.contactName,
      contactNotes: this.contactNotes,

    }
    this.VendorService.updateVendor(req)
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
