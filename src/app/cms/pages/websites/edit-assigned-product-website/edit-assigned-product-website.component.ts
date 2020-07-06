import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service'
@Component({
    selector: 'app-edit-assigned-product-website',
    templateUrl: './edit-assigned-product-website.component.html',
    styleUrls: ['./edit-assigned-product-website.component.scss']
})
export class EditAssignedProductWebsiteComponent implements OnInit {

    public websiteId: any;
    public productId: any;

    public currentWebsite: any;
    public productData: any;
    public productLoaded: boolean;
    public submitLoader: boolean;
    public editForm: FormGroup;
    crossReferenceDropDown = [];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private router: Router,
    ) {
        this.submitLoader = false;
    }

    ngOnInit() {
        this.productLoaded = false;
        this.websiteId = this.route.snapshot.params.website_id;
        this.productId = this.route.snapshot.params.product_id;
        this.loadProductDropBox();
        this.editForm = this.formBuilder.group({
            id: [null],
            website_id: [null],
            product_id: [null, Validators.required],
            name: [null, Validators.required],
            SKU: [null, Validators.required],
            price: [null, Validators.required],
            cost: [null, Validators.required],
            qty: [null, Validators.required],
            cross_reference_id: [null, Validators.required],
            cross_reference_check: [null],
            show_price: [null],
            is_in_stock: [null],
            active: [null],
            deleted: [null],
            created_at: [null],
            updated_at: [null]
        });
        this.loadProduct();
    }

    async loadProductDropBox() {
        try {
            this.http.get(environment.host + 'cross-reference').subscribe(async (res: any) => {
                if (res.success) {
                    this.crossReferenceDropDown = res.data;
                } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
            });
            this.http.get(environment.host + `website/${this.websiteId}`).subscribe(async (res: any) => {
                if (res.success) {
                    this.currentWebsite = res.data;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }



    async loadProduct() {
        try {
            const formData = new FormData();
            formData.append('website_id', this.websiteId);
            formData.append('product_id', this.productId);
            this.http.post(environment.host + 'webproduct/getAssignedProduct', formData).subscribe(async (res: any) => {
                if (res.success) {
                    this.productData = res.data[0];
                    this.productLoaded = true;
                    this.editForm.setValue(this.productData);
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async onSubmit() {
        this.submitLoader = true;
        this.editForm.controls.website_id.setValue(this.route.snapshot.params.id);
        this.http.post(environment.host + 'webProduct/assign', this.editForm.value).subscribe((res: any) => {
            this.submitLoader = false;
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Product updated successfully', type: 'success' });
                this.editForm.reset();
                this.router.navigate(['public/view-website']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        },
            (err: any) => {
                this.submitLoader = false;
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
    }

}
