import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm,FormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PurchaseOrderService } from '../shared/PurchaseOrder-service';
import { PurchaseOrderStatus } from 'src/app/shared/enums/PurchaseOrderStatus.enum';
import { VendorService } from '../../vendors/shared/vendor-service';
import { InventoryItemService } from '../../inventory-items/shared/inventory-item-service';
import { InventoryItem, PoInventoryItemDto } from '../shared/data';
@Component({
  selector: 'app-PurchaseOrder-add',
  templateUrl: './PurchaseOrder-add.component.html',
  styleUrls: ['./PurchaseOrder-add.component.scss']
})


export class PurchaseOrderAddComponent implements OnInit {
  @ViewChild('PurchaseOrderForm', { static: false }) purchaseOrderForm!: NgForm;
  PurchaseOrderNumber: string = "";
  ShippingAddress!: string;
  Price!: number;
  Quantity!: number;
  InventoryValue!: number;
  Notes:string="";
  Discounted: number = 0;
  Vendors!:any[];
  SelectedVendor:any;
  /*Items = [
    { label: 'In Stock', value: 'INSTOCK' },
    { label: 'Low Stock', value: 'LOWSTOCK' },
    { label: 'Out of Stock', value: 'OUTOFSTOCK' }
];*/products:any;
  Items:InventoryItem[]=[];
  SelectedItem!:any;
  SelectedPurchaseOrderItems:(PoInventoryItemDto | undefined)[]=[];
  selectedItemtest:any|undefined;
  SelectedStatus!:any;
  date!:Date;
  /*Status:PurchaseOrderStatus = 0;*/
   POS! :any[];
  keys!:any[];
  parmenantAddress: string | null = null;
  currentAddress: string | null = null;
  isCurrentSameAsParmenantAddress: boolean = false;
  personalEmailId: string | null = null;
  personalMobileNo: string | null = null;
  otherContactNo: string | null = null;
  joiningOn: any = new Date();
  today: any = new Date();
  formGroup!:FormGroup;
  constructor(private router: Router,
    private PurchaseOrderService: PurchaseOrderService,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private inventoryItemService :InventoryItemService
    ) { }
    
    AddNewItem(){
        let result = this.Items.filter(o1 => !this.SelectedPurchaseOrderItems.some(o2 => o1.id === o2?.id));
        this.SelectedPurchaseOrderItems.push(undefined)
       }
   
    onDropdownChange(event:any,i:number){//here where we add the new item to the list
        var row =document.getElementById('POI'+ i);
        
        var ItemCell=row!.querySelector('.dropdownp');
        if(this.SelectedPurchaseOrderItems.filter((el)=>{return el?.id==event.value.id}).length==2){
            this.showToast1();
            //this.SelectedPurchaseOrderItems[i]=structuredClone(this.SelectedPurchaseOrderItems[i])
            this.SelectedPurchaseOrderItems.splice(i,1);
            row?.remove();
        }
        else{
        this.SelectedPurchaseOrderItems[i]=structuredClone(this.SelectedPurchaseOrderItems[i])
    }
    }
    showToast1() {
        this.messageService.clear();
        this.messageService.add({ key: 'toast1', severity: 'warn', summary: 'Failed', detail: 'Can\'t add Item that has been already added.' });
    }
    onPriceChange(event:any,i:number,Element:any){
        console.log('changed')
        var row =document.getElementById('POI'+ i);
        var PriceCell=row!.querySelector('.Price') as HTMLInputElement;
        Element.price = Number(PriceCell.value);
        console.log(PriceCell.value);
    }
  
  ngOnInit(): void {
    this.POS = Object.keys(PurchaseOrderStatus).filter(key => isNaN(Number(key)));
    var req={
    };
    this.vendorService.getAllVendors(req).subscribe({
    next:(value:any) => {
      if (value && value.isValid) {
        if (value.data) {
          this.Vendors = value.data.vendors;
        }
      } else {
        this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
      }
    }  
  }
    );
  this.inventoryItemService.getAllInventoryItems(req).subscribe({
    next:(value:any) => {
      if (value && value.isValid) {
        if (value.data) {
          this.Items = value.data.inventoryItems;
            let item1 ={...this.Items[0]};
            item1.quantity=1;
            this.Items[0].quantity=1;

          this.SelectedPurchaseOrderItems=[
            undefined,
        ];
        }
      } else {
        this.messageService.add({ severity: 'error', detail: value.errorMessages[0] });
      }
    }  
  });
  
  }

  goToList() {
    this.router.navigateByUrl("/app/purchase-orders/list");
  }

  onClearClick(form: NgForm) {
    this.PurchaseOrderNumber = "";
    this.ShippingAddress = "";
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
    var selectedItems= structuredClone(this.SelectedPurchaseOrderItems);
    var PurchaseOrderItems = selectedItems
    .filter((item:any) => item && item.id && item.quantity && item.price) // Filter out items that are empty or have missing fields
    .map((item:any) => ({
        inventoryItemId: item.id,
        quantity: item.quantity,
        price: item.price
    }));
   //selectedItems = selectedItems.filter((e:InventoryItem)=>{return e!=undefined});
    var req = {
      vendorId:this.SelectedVendor.id,
      PurchaserOrderquantity: this.Quantity,
      PurchaseOrderNumber:this.PurchaseOrderNumber,
      PurchaseOrderDate:this.date,
      shippingAddress:this.ShippingAddress,
      PurchaserOrderNotes:this.Notes,
      PurchaserOrderStatus:Number(this.SelectedStatus.key),
      purchaseOrderItems:PurchaseOrderItems

    }
    this.PurchaseOrderService.createPurchaseOrder(req)
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
  
 

getProductsWithOrdersData() {
    return [
        {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1000-0',
                    productCode: 'f230fh0g3',
                    date: '2020-09-13',
                    amount: 65,
                    quantity: 1,
                    customer: 'David James',
                    status: 'PENDING'
                },
                {
                    id: '1000-1',
                    productCode: 'f230fh0g3',
                    date: '2020-05-14',
                    amount: 130,
                    quantity: 2,
                    customer: 'Leon Rodrigues',
                    status: 'DELIVERED'
                },
                {
                    id: '1000-2',
                    productCode: 'f230fh0g3',
                    date: '2019-01-04',
                    amount: 65,
                    quantity: 1,
                    customer: 'Juan Alejandro',
                    status: 'RETURNED'
                },
                {
                    id: '1000-3',
                    productCode: 'f230fh0g3',
                    date: '2020-09-13',
                    amount: 195,
                    quantity: 3,
                    customer: 'Claire Morrow',
                    status: 'CANCELLED'
                }
            ]
        },
        {
            id: '1001',
            code: 'nvklal433',
            name: 'Black Watch',
            description: 'Product Description',
            image: 'black-watch.jpg',
            price: 72,
            category: 'Accessories',
            quantity: 61,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1001-0',
                    productCode: 'nvklal433',
                    date: '2020-05-14',
                    amount: 72,
                    quantity: 1,
                    customer: 'Maisha Jefferson',
                    status: 'DELIVERED'
                },
                {
                    id: '1001-1',
                    productCode: 'nvklal433',
                    date: '2020-02-28',
                    amount: 144,
                    quantity: 2,
                    customer: 'Octavia Murillo',
                    status: 'PENDING'
                }
            ]
        },
        {
            id: '1002',
            code: 'zz21cz3c1',
            name: 'Blue Band',
            description: 'Product Description',
            image: 'blue-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1002-0',
                    productCode: 'zz21cz3c1',
                    date: '2020-07-05',
                    amount: 79,
                    quantity: 1,
                    customer: 'Stacey Leja',
                    status: 'DELIVERED'
                },
                {
                    id: '1002-1',
                    productCode: 'zz21cz3c1',
                    date: '2020-02-06',
                    amount: 79,
                    quantity: 1,
                    customer: 'Ashley Wickens',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1003',
            code: '244wgerg2',
            name: 'Blue T-Shirt',
            description: 'Product Description',
            image: 'blue-t-shirt.jpg',
            price: 29,
            category: 'Clothing',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: []
        },
        {
            id: '1004',
            code: 'h456wer53',
            name: 'Bracelet',
            description: 'Product Description',
            image: 'bracelet.jpg',
            price: 15,
            category: 'Accessories',
            quantity: 73,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1004-0',
                    productCode: 'h456wer53',
                    date: '2020-09-05',
                    amount: 60,
                    quantity: 4,
                    customer: 'Mayumi Misaki',
                    status: 'PENDING'
                },
                {
                    id: '1004-1',
                    productCode: 'h456wer53',
                    date: '2019-04-16',
                    amount: 2,
                    quantity: 30,
                    customer: 'Francesco Salvatore',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1005',
            code: 'av2231fwg',
            name: 'Brown Purse',
            description: 'Product Description',
            image: 'brown-purse.jpg',
            price: 120,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1005-0',
                    productCode: 'av2231fwg',
                    date: '2020-01-25',
                    amount: 120,
                    quantity: 1,
                    customer: 'Isabel Sinclair',
                    status: 'RETURNED'
                },
                {
                    id: '1005-1',
                    productCode: 'av2231fwg',
                    date: '2019-03-12',
                    amount: 240,
                    quantity: 2,
                    customer: 'Lionel Clifford',
                    status: 'DELIVERED'
                },
                {
                    id: '1005-2',
                    productCode: 'av2231fwg',
                    date: '2019-05-05',
                    amount: 120,
                    quantity: 1,
                    customer: 'Cody Chavez',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1006',
            code: 'bib36pfvm',
            name: 'Chakra Bracelet',
            description: 'Product Description',
            image: 'chakra-bracelet.jpg',
            price: 32,
            category: 'Accessories',
            quantity: 5,
            inventoryStatus: 'LOWSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1006-0',
                    productCode: 'bib36pfvm',
                    date: '2020-02-24',
                    amount: 32,
                    quantity: 1,
                    customer: 'Arvin Darci',
                    status: 'DELIVERED'
                },
                {
                    id: '1006-1',
                    productCode: 'bib36pfvm',
                    date: '2020-01-14',
                    amount: 64,
                    quantity: 2,
                    customer: 'Izzy Jones',
                    status: 'PENDING'
                }
            ]
        },
        {
            id: '1007',
            code: 'mbvjkgip5',
            name: 'Galaxy Earrings',
            description: 'Product Description',
            image: 'galaxy-earrings.jpg',
            price: 34,
            category: 'Accessories',
            quantity: 23,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1007-0',
                    productCode: 'mbvjkgip5',
                    date: '2020-06-19',
                    amount: 34,
                    quantity: 1,
                    customer: 'Jennifer Smith',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1008',
            code: 'vbb124btr',
            name: 'Game Controller',
            description: 'Product Description',
            image: 'game-controller.jpg',
            price: 99,
            category: 'Electronics',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1008-0',
                    productCode: 'vbb124btr',
                    date: '2020-01-05',
                    amount: 99,
                    quantity: 1,
                    customer: 'Jeanfrancois David',
                    status: 'DELIVERED'
                },
                {
                    id: '1008-1',
                    productCode: 'vbb124btr',
                    date: '2020-01-19',
                    amount: 198,
                    quantity: 2,
                    customer: 'Ivar Greenwood',
                    status: 'RETURNED'
                }
            ]
        },
        {
            id: '1009',
            code: 'cm230f032',
            name: 'Gaming Set',
            description: 'Product Description',
            image: 'gaming-set.jpg',
            price: 299,
            category: 'Electronics',
            quantity: 63,
            inventoryStatus: 'INSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1009-0',
                    productCode: 'cm230f032',
                    date: '2020-06-24',
                    amount: 299,
                    quantity: 1,
                    customer: 'Kadeem Mujtaba',
                    status: 'PENDING'
                },
                {
                    id: '1009-1',
                    productCode: 'cm230f032',
                    date: '2020-05-11',
                    amount: 299,
                    quantity: 1,
                    customer: 'Ashley Wickens',
                    status: 'DELIVERED'
                },
                {
                    id: '1009-2',
                    productCode: 'cm230f032',
                    date: '2019-02-07',
                    amount: 299,
                    quantity: 1,
                    customer: 'Julie Johnson',
                    status: 'DELIVERED'
                },
                {
                    id: '1009-3',
                    productCode: 'cm230f032',
                    date: '2020-04-26',
                    amount: 299,
                    quantity: 1,
                    customer: 'Tony Costa',
                    status: 'CANCELLED'
                }
            ]
        },
        {
            id: '1010',
            code: 'plb34234v',
            name: 'Gold Phone Case',
            description: 'Product Description',
            image: 'gold-phone-case.jpg',
            price: 24,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1010-0',
                    productCode: 'plb34234v',
                    date: '2020-02-04',
                    amount: 24,
                    quantity: 1,
                    customer: 'James Butt',
                    status: 'DELIVERED'
                },
                {
                    id: '1010-1',
                    productCode: 'plb34234v',
                    date: '2020-05-05',
                    amount: 48,
                    quantity: 2,
                    customer: 'Josephine Darakjy',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1011',
            code: '4920nnc2d',
            name: 'Green Earbuds',
            description: 'Product Description',
            image: 'green-earbuds.jpg',
            price: 89,
            category: 'Electronics',
            quantity: 23,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1011-0',
                    productCode: '4920nnc2d',
                    date: '2020-06-01',
                    amount: 89,
                    quantity: 1,
                    customer: 'Art Venere',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1012',
            code: '250vm23cc',
            name: 'Green T-Shirt',
            description: 'Product Description',
            image: 'green-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 74,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1012-0',
                    productCode: '250vm23cc',
                    date: '2020-02-05',
                    amount: 49,
                    quantity: 1,
                    customer: 'Lenna Paprocki',
                    status: 'DELIVERED'
                },
                {
                    id: '1012-1',
                    productCode: '250vm23cc',
                    date: '2020-02-15',
                    amount: 49,
                    quantity: 1,
                    customer: 'Donette Foller',
                    status: 'PENDING'
                }
            ]
        },
        {
            id: '1013',
            code: 'fldsmn31b',
            name: 'Grey T-Shirt',
            description: 'Product Description',
            image: 'grey-t-shirt.jpg',
            price: 48,
            category: 'Clothing',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1013-0',
                    productCode: 'fldsmn31b',
                    date: '2020-04-01',
                    amount: 48,
                    quantity: 1,
                    customer: 'Simona Morasca',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1014',
            code: 'waas1x2as',
            name: 'Headphones',
            description: 'Product Description',
            image: 'headphones.jpg',
            price: 175,
            category: 'Electronics',
            quantity: 8,
            inventoryStatus: 'LOWSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1014-0',
                    productCode: 'waas1x2as',
                    date: '2020-05-15',
                    amount: 175,
                    quantity: 1,
                    customer: 'Lenna Paprocki',
                    status: 'DELIVERED'
                },
                {
                    id: '1014-1',
                    productCode: 'waas1x2as',
                    date: '2020-01-02',
                    amount: 175,
                    quantity: 1,
                    customer: 'Donette Foller',
                    status: 'CANCELLED'
                }
            ]
        },
        {
            id: '1015',
            code: 'vb34btbg5',
            name: 'Light Green T-Shirt',
            description: 'Product Description',
            image: 'light-green-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 34,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1015-0',
                    productCode: 'vb34btbg5',
                    date: '2020-07-02',
                    amount: 98,
                    quantity: 2,
                    customer: 'Mitsue Tollner',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1016',
            code: 'k8l6j58jl',
            name: 'Lime Band',
            description: 'Product Description',
            image: 'lime-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 12,
            inventoryStatus: 'INSTOCK',
            rating: 3,
            orders: []
        },
        {
            id: '1017',
            code: 'v435nn85n',
            name: 'Mini Speakers',
            description: 'Product Description',
            image: 'mini-speakers.jpg',
            price: 85,
            category: 'Clothing',
            quantity: 42,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1017-0',
                    productCode: 'v435nn85n',
                    date: '2020-07-12',
                    amount: 85,
                    quantity: 1,
                    customer: 'Minna Amigon',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1018',
            code: '09zx9c0zc',
            name: 'Painted Phone Case',
            description: 'Product Description',
            image: 'painted-phone-case.jpg',
            price: 56,
            category: 'Accessories',
            quantity: 41,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1018-0',
                    productCode: '09zx9c0zc',
                    date: '2020-07-01',
                    amount: 56,
                    quantity: 1,
                    customer: 'Abel Maclead',
                    status: 'DELIVERED'
                },
                {
                    id: '1018-1',
                    productCode: '09zx9c0zc',
                    date: '2020-05-02',
                    amount: 56,
                    quantity: 1,
                    customer: 'Minna Amigon',
                    status: 'RETURNED'
                }
            ]
        },
        {
            id: '1019',
            code: 'mnb5mb2m5',
            name: 'Pink Band',
            description: 'Product Description',
            image: 'pink-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 63,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: []
        },
        {
            id: '1020',
            code: 'r23fwf2w3',
            name: 'Pink Purse',
            description: 'Product Description',
            image: 'pink-purse.jpg',
            price: 110,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1020-0',
                    productCode: 'r23fwf2w3',
                    date: '2020-05-29',
                    amount: 110,
                    quantity: 1,
                    customer: 'Kiley Caldarera',
                    status: 'DELIVERED'
                },
                {
                    id: '1020-1',
                    productCode: 'r23fwf2w3',
                    date: '2020-02-11',
                    amount: 220,
                    quantity: 2,
                    customer: 'Graciela Ruta',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1021',
            code: 'pxpzczo23',
            name: 'Purple Band',
            description: 'Product Description',
            image: 'purple-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 6,
            inventoryStatus: 'LOWSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1021-0',
                    productCode: 'pxpzczo23',
                    date: '2020-02-02',
                    amount: 79,
                    quantity: 1,
                    customer: 'Cammy Albares',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1022',
            code: '2c42cb5cb',
            name: 'Purple Gemstone Necklace',
            description: 'Product Description',
            image: 'purple-gemstone-necklace.jpg',
            price: 45,
            category: 'Accessories',
            quantity: 62,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1022-0',
                    productCode: '2c42cb5cb',
                    date: '2020-06-29',
                    amount: 45,
                    quantity: 1,
                    customer: 'Mattie Poquette',
                    status: 'DELIVERED'
                },
                {
                    id: '1022-1',
                    productCode: '2c42cb5cb',
                    date: '2020-02-11',
                    amount: 135,
                    quantity: 3,
                    customer: 'Meaghan Garufi',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1023',
            code: '5k43kkk23',
            name: 'Purple T-Shirt',
            description: 'Product Description',
            image: 'purple-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 5,
            orders: [
                {
                    id: '1023-0',
                    productCode: '5k43kkk23',
                    date: '2020-04-15',
                    amount: 49,
                    quantity: 1,
                    customer: 'Gladys Rim',
                    status: 'RETURNED'
                }
            ]
        },
        {
            id: '1024',
            code: 'lm2tny2k4',
            name: 'Shoes',
            description: 'Product Description',
            image: 'shoes.jpg',
            price: 64,
            category: 'Clothing',
            quantity: 0,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: []
        },
        {
            id: '1025',
            code: 'nbm5mv45n',
            name: 'Sneakers',
            description: 'Product Description',
            image: 'sneakers.jpg',
            price: 78,
            category: 'Clothing',
            quantity: 52,
            inventoryStatus: 'INSTOCK',
            rating: 4,
            orders: [
                {
                    id: '1025-0',
                    productCode: 'nbm5mv45n',
                    date: '2020-02-19',
                    amount: 78,
                    quantity: 1,
                    customer: 'Yuki Whobrey',
                    status: 'DELIVERED'
                },
                {
                    id: '1025-1',
                    productCode: 'nbm5mv45n',
                    date: '2020-05-21',
                    amount: 78,
                    quantity: 1,
                    customer: 'Fletcher Flosi',
                    status: 'PENDING'
                }
            ]
        },
        {
            id: '1026',
            code: 'zx23zc42c',
            name: 'Teal T-Shirt',
            description: 'Product Description',
            image: 'teal-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 3,
            inventoryStatus: 'LOWSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1026-0',
                    productCode: 'zx23zc42c',
                    date: '2020-04-24',
                    amount: 98,
                    quantity: 2,
                    customer: 'Bette Nicka',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1027',
            code: 'acvx872gc',
            name: 'Yellow Earbuds',
            description: 'Product Description',
            image: 'yellow-earbuds.jpg',
            price: 89,
            category: 'Electronics',
            quantity: 35,
            inventoryStatus: 'INSTOCK',
            rating: 3,
            orders: [
                {
                    id: '1027-0',
                    productCode: 'acvx872gc',
                    date: '2020-01-29',
                    amount: 89,
                    quantity: 1,
                    customer: 'Veronika Inouye',
                    status: 'DELIVERED'
                },
                {
                    id: '1027-1',
                    productCode: 'acvx872gc',
                    date: '2020-06-11',
                    amount: 89,
                    quantity: 1,
                    customer: 'Willard Kolmetz',
                    status: 'DELIVERED'
                }
            ]
        },
        {
            id: '1028',
            code: 'tx125ck42',
            name: 'Yoga Mat',
            description: 'Product Description',
            image: 'yoga-mat.jpg',
            price: 20,
            category: 'Fitness',
            quantity: 15,
            inventoryStatus: 'INSTOCK',
            rating: 5,
            orders: []
        },
        {
            id: '1029',
            code: 'gwuby345v',
            name: 'Yoga Set',
            description: 'Product Description',
            image: 'yoga-set.jpg',
            price: 20,
            category: 'Fitness',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 8,
            orders: [
                {
                    id: '1029-0',
                    productCode: 'gwuby345v',
                    date: '2020-02-14',
                    amount: 4,
                    quantity: 80,
                    customer: 'Maryann Royster',
                    status: 'DELIVERED'
                }
            ]
        }
    ];
}
}