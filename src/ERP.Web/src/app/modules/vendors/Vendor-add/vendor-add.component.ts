import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { VendorService } from '../shared/vendor-service';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit {

  Vendor: string = "";
  Description!: string;
  City!: string;
  ZipCode!: string;
  VendorAddress: string | null = null;
  Country: string | null = null;
  Email!: string;
  ContactName: string | null = null;
  ContactNotes!: string;
  Phone:string | null = null;
  otherContactNo: string | null = null;
  joiningOn: any = new Date();
  today: any = new Date();

  constructor(private router: Router,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  goToList() {
    this.router.navigateByUrl("/app/vendors/list");
  }

  onClearClick(form: NgForm) {
    this.Vendor = "";
    this.Description = "";
    /*this.middleName ;*/
    this.VendorAddress = null;
    this.Country = null;
    this.ContactName = null;
    this.otherContactNo = null;

    form.resetForm();
    this.joiningOn = new Date();
  }

  onChangeSameAsAddress() {
    if (this.Email) {
      this.Country = null;
    }
  }

  onSubmit() {
    this.loaderService.showLoader();
    var req = {
      vendorName: this.Vendor,
      vendorAddress:this.VendorAddress,
      vendorCity: this.City,
      vendorZipCode: this.ZipCode,
      vendorCountry: this.Country,
      vendorPhone: this.Country,
      vendorEmail:this.Email,
      contactName:this.ContactName,
      contactNotes:this.ContactNotes
    }
    this.vendorService.createVendor(req)
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
