import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service'
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService) {
        this.submitLoader = false;
    }

    public submitLoader: boolean;
    public editForm: FormGroup;

    public categoryDropDown: any;
    public brandDropDown: any;
    public productData: any;

    selectedCategory: any;
    selectedBrand: any;

    public eventData: any;

    ngOnInit() {
        this.getProductByID();
        this.editForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            category_id: ['this.productData.category_id', [Validators.required]],
            brand_id: ['this.productData.brand_id', [Validators.required]],
            SKU: ['', Validators.required],
            description: ['', Validators.required],
            attribute_group_id: [''],
            active: [''],
            created_by: [''],
            created_at: [''],
            updated_at: [''],
            updated_by: [''],
            deleted: [''],
            category: [''],
            brand: [''],
            attributes: ['']
        });
        this.loadCategoryDropBox();
        this.loadBrandDropBox();
    }

    async loadCategoryDropBox() {
        try {
            this.http.get(environment.host + 'category').subscribe(async (res: any) => {
                if (res) {
                    this.categoryDropDown = res;
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async loadBrandDropBox() {
        try {
            this.http.get(environment.host + 'brand').subscribe(async (res: any) => {
                if (res) {
                    this.brandDropDown = res;
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async onSubmit() {
        this.submitLoader = true;
        const userID = localStorage.getItem('user');
        this.editForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'product', this.editForm.value).subscribe((res: any) => {
                this.submitLoader = false;
                if (res.success) {
                    this.toastr.addToast({ title: 'Success', msg: 'Product updated successfully', type: 'success'});
                    this.router.navigate(['public/view-product']);
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            },
            (err: any) => {
                this.submitLoader = false;
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
    }

    async getProductByID() {
        this.http.get(environment.host + 'product/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
              this.productData = res.data;
              this.editForm.setValue(res.data);
            });
    }
}
