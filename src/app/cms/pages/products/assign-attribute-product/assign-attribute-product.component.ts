import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderService } from '../../../services/uploader.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-assign-attribute-product',
    templateUrl: './assign-attribute-product.component.html',
    styleUrls: ['./assign-attribute-product.component.scss']
})
export class AssignAttributeProductComponent implements OnInit {

    attributeGroupLoading = true;
    attributeLoading = false;
    attributeDataLoaded = false;
    submitLoader = false;

    addForm: FormGroup;
    get f() { return this.addForm.controls; }
    get t() { return this.f.attributes as FormArray; }

    productData: any;
    attributeGroupList = [];
    attributeList = [];
    unitList: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService
    ) { }


    ngOnInit() {
        this.submitLoader = false;
        this.attributeGroupLoading = true;
        this.attributeLoading = false;
        this.attributeDataLoaded = false;
        this.productData = null;


        this.getProductByID();
        this.getAttributeGroupList();
        this.addForm = this.formBuilder.group({
            product_id: [null],
            attribute_group: [null, Validators.required],
            created_by: [null],
            updated_by: [null],
            attributes: new FormArray([])
        });
    }

    async getProductByID() {
        this.http.get(environment.host + 'product/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                if (res.success) {
                    this.productData = res.data;
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error in product loading',
                        type: 'error',
                    }).then(() => {
                        this.router.navigate(['public/view-product']);
                    });
                }
            });
    }


    getAttributeGroupList() {
        this.http.get(environment.host + 'attributeGroup').subscribe((res: any) => {
            if (res.success) {
                this.attributeGroupLoading = false;
                this.attributeGroupList = res.data;
            } else if (!res.success) {
                this.attributeGroupLoading = false;
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    getAttributes(e) {
        if (this.productData) {
            this.attributeLoading = true;
            this.attributeDataLoaded = false;
            this.attributeList = [];
            this.unitList = [];
            this.t.reset();
            this.t.clear();
            this.http.get(environment.host + 'attributeGroup/withAll/' + e.id + '/' + this.productData.category_id).subscribe((res: any) => {
                if (res.success) {
                    this.attributeList = res.data.attributes;
                    this.attributeList.forEach((item: any) => {
                        this.unitList.push(item.units);
                        this.t.push(this.formBuilder.group({
                            attribute_id: item.id,
                            value: [null],
                            attribute_unit_id: [null]
                        }));
                    });
                    this.attributeLoading = false;
                    this.attributeDataLoaded = true;
                } else if (!res.success) {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (error: any) => {
                this.toastr.addToast({ title: 'Error', msg: error.message, type: 'error' });
            });
        }
        else {
            this.toastr.addToast({ title: 'Error', msg: "Please wait while product is being loaded", type: 'error' });
        }
    }



    async onSubmit() {
        this.submitLoader = true;
        this.addForm.controls.product_id.setValue(this.route.snapshot.params.id);
        const userID = localStorage.getItem('user');
        this.addForm.controls.created_by.setValue(userID);
        this.addForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'assignment/assign', this.addForm.value).subscribe((res: any) => {
            this.submitLoader = false;
            if (res.success) {
                this.getProductByID();
                this.toastr.addToast({ title: 'Success', msg: 'Attribute assigned successfully', type: 'success' });
                this.router.navigate(['public/detail-product', this.addForm.controls.product_id.value]);
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