import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import Swal from 'sweetalert2';
import { NgSelectComponent } from '@ng-select/ng-select';


@Component({
    selector: 'app-edit-complete-product',
    templateUrl: './edit-complete-product.component.html',
    styleUrls: ['./edit-complete-product.component.scss']
})
export class EditCompleteProductComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService
    ) { }

    @ViewChild('forModalClose') forCloseModal: ElementRef<HTMLElement>;
    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

    get f() { return this.productDetailsForm.controls; }
    get t() { return this.f.attributes as FormArray; }

    get c() { return this.jointAttributeForm.controls; }
    get j() { return this.c.attributes as FormArray; }

    submitLoader = false;
    addButtonEnable = false;

    public globalAttributeGroupID: any;
    public globalSelectedAttributesGroup: any;
    public addNewAtribute: any;
    public addNewAtbSelected = false;
    public globalAddNewAttributeForm: FormGroup;

    public dataLoaded = false;
    public productSelected = false;
    public categoryDropDown: any;
    public brandDropDown: any;
    public productAccessoriesDropDown: any;
    public productAccessoriesSelected = [];

    public attributeList: any;
    public unitList: any;
    public productList = [];
    public productListLoading = true;
    public productDetails: any;

    public productForm: FormGroup;
    public productDetailsForm: FormGroup;
    gotRoute = false;
    gotRouteID = '';


    // JOINT ATTRIBUTES
    toggleJointAttribute = false;
    jointAtrributesList = [];
    selectedJointAttributeIDForAdd = '';
    JOINT_ATTRIBUTE_LIST = [];
    jointAttributeForm: FormGroup;

    async clearAll() {
        this.dataLoaded = false;
        this.productSelected = false;
        this.t.reset();
        this.t.clear();
        this.submitLoader = false;
        this.attributeList = [];
        this.addButtonEnable = false;
        this.unitList = [];
        this.productList = [];
        this.productListLoading = true;
        this.productDetails = [];
        this.categoryDropDown = [];
        this.brandDropDown = [];
        this.globalAttributeGroupID = '';
        this.globalSelectedAttributesGroup = [];
        this.addNewAtribute = [];
        this.addNewAtbSelected = false;
        this.productDetailsForm.reset();
        this.globalAddNewAttributeForm.reset();
        this.loadCategoryDropBox();
        this.loadBrandDropBox();
        this.loadProducts();
        // JOINT ATTRIBUTE
        this.jointAttributesOnInit();
        //Images
        this.loadImages();
    }

    ngOnInit() {
        this.productForm = this.formBuilder.group({
            product: [null, [Validators.required]]
        });
        this.jointAttributeForm = this.formBuilder.group({
            attributes: new FormArray([])
        });
        this.globalAddNewAttributeForm = this.formBuilder.group({
            product_id: [null],
            attribute_id: [null, [Validators.required]],
            attribute_unit_id: [null, [Validators.required]],
            value: [null, [Validators.required]],
        });
        this.productDetailsForm = this.formBuilder.group({
            id: [null],
            name: [null, Validators.required],
            category_id: ['this.productData.category_id', [Validators.required]],
            brand_id: ['this.productData.brand_id', [Validators.required]],
            SKU: [null, Validators.required],
            description: [null, Validators.required],
            attribute_group_id: [null],
            active: [null],
            created_by: [null],
            created_at: [null],
            updated_at: [null],
            updated_by: [null],
            deleted: [null],
            category: [null],
            brand: [null],
            accessories: [],
            attributes: new FormArray([]),
        });
        this.clearAll();
        if (this.route.snapshot.paramMap.get('id')) {
            this.gotRoute = true;
            this.gotRouteID = this.route.snapshot.paramMap.get('id');
            this.loadProductByID();
        }
    }

    async loadProducts() {
        this.http.get(environment.host + 'product/forDropdown').subscribe((res: any) => {
            if (res.success) {
                this.productAccessoriesDropDown = res.data;
                // const result = [];
                // for (const d of res.data) {
                //     if (d.attribute_group_id) {
                //         result.push(d);
                //     }
                // }
                // this.productList = result;
                // this.productListLoading = false;
            } else {
                // this.productListLoading = false;
                this.toastr.addToast({ title: 'Error1', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async loadCategoryDropBox() {
        try {
            this.http.get(environment.host + 'category').subscribe(async (res: any) => {
                res.success ? this.categoryDropDown = res.data: this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async loadBrandDropBox() {
        try {
            this.http.get(environment.host + 'brand').subscribe(async (res: any) => {
                if (res.success) {
                    this.brandDropDown = res.data;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async getAttributesOfGroup() {
        try {
            this.http.get(`${environment.host}attributeGroup/withAll/${this.globalAttributeGroupID}/${this.productDetails.category_id}`).subscribe(async (res: any) => {
                if (res.success) {
                    this.globalSelectedAttributesGroup = res.data;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async getAttributesForNew(e) {
        this.addNewAtbSelected = false;
        this.addNewAtribute = [];
        this.globalAddNewAttributeForm.controls.value.setValue(null);
        this.globalAddNewAttributeForm.controls.attribute_unit_id.setValue(null);
        try {
            if (e.id) {
                this.http.get(`${environment.host}attribute/${e.id}/${this.productDetails.category_id}`).subscribe(async (res: any) => {
                    if (res.success) {
                        this.addNewAtribute = res.data;
                        this.addNewAtbSelected = true;
                        this.addButtonEnable = true;
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    }
                });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    // Main Product Loading
    async loadProductByID() {
        const productID = this.gotRoute ? this.gotRouteID : this.productForm.controls.product.value;
        this.productSelected = true;
        if (productID) {
            this.http.get(environment.host + 'product/' + productID).subscribe(async (res: any) => {
                if (res.success) {
                    try {
                        this.productDetails = res.data;
                        this.attributeList = res.data.attributes;
                        this.globalAttributeGroupID = res.data.attribute_group_id;
                        this.JOINT_ATTRIBUTE_LIST = res.data.joint_attributes;

                        this.productDetailsForm.controls.id.setValue(res.data.id);
                        this.productDetailsForm.controls.category_id.setValue(res.data.category_id);
                        this.productDetailsForm.controls.brand_id.setValue(res.data.brand_id);
                        this.productDetailsForm.controls.attribute_group_id.setValue(res.data.attribute_group_id);
                        this.productDetailsForm.controls.name.setValue(res.data.name);
                        this.productDetailsForm.controls.SKU.setValue(res.data.SKU);
                        this.productDetailsForm.controls.description.setValue(res.data.description);
                        this.productDetailsForm.controls.active.setValue(res.data.active);
                        this.productDetailsForm.controls.deleted.setValue(res.data.deleted);
                        this.productDetailsForm.controls.created_at.setValue(res.data.created_at);
                        this.productDetailsForm.controls.created_by.setValue(res.data.created_by);
                        this.productDetailsForm.controls.updated_at.setValue(res.data.updated_at);
                        this.productDetailsForm.controls.updated_by.setValue(res.data.updated_by);
                        this.productDetailsForm.controls.category.setValue(res.data.category);
                        this.productDetailsForm.controls.brand.setValue(res.data.brand);

                        this.attributeList.forEach(async (item: any) => {
                            await this.unitList.push(item.units);
                            if (item.type === 'Multi-Select-DropDown') {
                                const doneItem = {
                                    attribute_id: item.id,
                                    value: [],
                                    attribute_unit_id: item.pivot.attribute_unit_id ? item.pivot.attribute_unit_id : null
                                };
                                this.t.push(this.formBuilder.group(doneItem));

                                const multiValue = await item.pivot.value ? item.pivot.value.split(',') : [];
                                const ext = [];
                                await multiValue.forEach(async (id: any) => {
                                    ext.push(Number(id));
                                });
                                item.selected = ext;
                            } else {
                                this.t.push(this.formBuilder.group({
                                    attribute_id: item.id,
                                    value: item.pivot.value ? item.pivot.value : null,
                                    attribute_unit_id: item.pivot.attribute_unit_id ? item.pivot.attribute_unit_id : null
                                }));
                            }
                        });



                        if (res.data.accessories && Array(res.data.accessories).length > 0) {
                            const data = [];
                            for (const acc of res.data.accessories) {
                                data.push(acc.id);
                            }
                            this.productAccessoriesSelected = data;
                        }

                        this.getAttributesOfGroup();
                        this.imagesSelected = res.data.assignedImages;
                        this.loadImageURL(res.data.assignedImagesForUrl);
                    } catch (e) {
                        this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
                    }
                    this.dataLoaded = true;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
        }
    }


    async onSubmit() {
        try {
            this.submitLoader = true;
            const accessoriesBody = {
                product_id: this.productDetails.id,
                accessories: this.productAccessoriesSelected
            };
            const userID = localStorage.getItem('user');
            this.productDetailsForm.controls.updated_by.setValue(userID);
            this.productDetailsForm.controls.created_by.setValue(userID);
            this.http.post(environment.host + 'product', this.productDetailsForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.http.post(environment.host + 'product/updateproductAccessories', accessoriesBody).subscribe((res: any) => {
                        if (res.success) {
                            this.submitLoader = false;
                            this.toastr.addToast({ title: 'Success', msg: 'Product successfully updated', type: 'success' });
                            this.router.navigate(['public/detail-product', this.productDetailsForm.controls.id.value]);
                        } else {
                            this.submitLoader = false;
                            this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                        }
                    });
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async onUpdate(index, id) {
        this.toastr.addToast({ title: 'Please wait', msg: 'Attribute is updating', type: 'wait' });
        const temp = this.productDetailsForm.controls.attributes.value[index];
        const body = {
            product_id: this.productDetailsForm.controls.id.value,
            attribute_id: temp.attribute_id,
            attribute_unit_id: temp.attribute_unit_id,
            value: temp.value
        };
        this.http.post(environment.host + 'assignment/updateSingleAttribute', body).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Attribute Updated Successfully', type: 'success' });
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async onDeassign(attributeID) {
        const body = {
            product_id: this.productDetails.id,
            attribute_id: attributeID
        };
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to deassign this attribute',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then(async (willDelete) => {
            if (!willDelete.dismiss) {
                this.http.post(environment.host + 'assignment/deassignAttribute', body).subscribe(async (res: any) => {
                    if (res.success) {
                        await this.clearAll();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                        await this.loadProductByID();
                    } else if (!res.success) {
                        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        });
    }

    async onAddNewAttribute(type) {
        (this.forCloseModal.nativeElement).click();
        this.toastr.addToast({ title: 'Please Wait', msg: 'Assigning attribute to product', type: 'wait' });
        if (this.toggleJointAttribute) {
            const body = {
                product_id: this.productDetailsForm.controls.id.value,
                joint_attribute_id: this.selectedJointAttributeIDForAdd,
                row: 1,
            };
            this.http.post(environment.host + 'assignment/joint/assignSingleAttribute', body).subscribe(async (res: any) => {
                if (res.success) {
                    await this.clearAll();
                    this.toastr.addToast({ title: 'Success', msg: 'Joint Attribute Added Successfully', type: 'success' });
                    await this.loadProductByID();
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
        } else {
            this.globalAddNewAttributeForm.controls.product_id.setValue(this.productDetailsForm.controls.id.value);
            this.http.post(environment.host + 'assignment/addSingleAttribute', this.globalAddNewAttributeForm.value).subscribe(async (res: any) => {
                if (res.success) {
                    await this.clearAll();
                    this.toastr.addToast({ title: 'Success', msg: 'Attribute Assigned Successfully', type: 'success' });
                    await this.loadProductByID();
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
        }
    }



    jointAttributesOnInit() {
        this.getJointAttributeListForNew();
    }

    getJointAttributeListForNew() {
        this.http.get(`${environment.host}joint-attribute`).subscribe(async (res: any) => {
            if (res.success) {
                this.jointAtrributesList = res.data;
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        });
    }

    onToggleChange(e) {
        this.toggleJointAttribute = e.target.checked;
    }

    onChangeToggelAddButton(e) {
        this.addButtonEnable = true;
        this.selectedJointAttributeIDForAdd = e.id;
    }


    async onIncrementClick(attributes, i) {
        const body = {
            product_id: this.productDetailsForm.controls.id.value,
            joint_attribute_id: this.JOINT_ATTRIBUTE_LIST[i].id,
            row: attributes.length + 1,
        };
        this.http.post(environment.host + 'assignment/joint/assignSingleAttribute', body).subscribe(async (res: any) => {
            if (res.success) {
                await this.clearAll();
                this.toastr.addToast({ title: 'Success', msg: 'Joint Attribute Added Successfully', type: 'success' });
                await this.loadProductByID();
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async onDecreamentClick(i, attributeArray) {
        if (this.JOINT_ATTRIBUTE_LIST[i].attributes.length > 1 && attributeArray.length > 0) {
            if(attributeArray[0].ROW != 1) {
                const body = {
                    product_id: this.productDetails.id ? this.productDetails.id : null,
                    joint_attribute_id: this.JOINT_ATTRIBUTE_LIST[i].id,
                    row: attributeArray[0].ROW
                }
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You want to remove this row',
                    type: 'warning',
                    showCloseButton: true,
                    showCancelButton: true
                }).then((willDelete) => {
                    if (!willDelete.dismiss) {
                        this.http.post(environment.host + 'assignment/joint/deassignSingleAttributeRow', body).subscribe(async (res: any) => {
                            if (res.success) {
                                await this.clearAll();
                                this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                                await this.loadProductByID();
                            } else if (!res.success) {
                                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                            }
                        }, (err: any) => {
                            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                        });
                    }
                });
            } else {
            }
        } else {
                this.toastr.addToast({ title: 'Error', msg: "Only single row is remaining. Please deassign this attribute", type: 'error' });
        }
    }

    async onUpdateJointAttribute(item) {
        this.toastr.addToast({ title: 'Please wait', msg: 'Attribute is updating', type: 'wait' });
        const body = {
            product_id: this.productDetails.id ? this.productDetails.id : null,
            joint_attribute_id: item.id ? item.id : null,
            attributes: []
        };
        item.attributes.forEach((itm) => {
            for (let i of itm) {
                let temp = {
                    attribute_id: i.id,
                    value: i.SELECTED_VALUE,
                    attribute_unit_id: i.SELECTED_UNIT_ID,
                    row: i.ROW,
                };
                body.attributes.push(temp);
            }
        });
        this.http.post(environment.host + 'assignment/joint/updateSingleAttribute', body).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Attribute Updated Successfully', type: 'success' });
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async onDeassignJointAttribute(item) {
        const body = {
            joint_attribute_id: item.id ? item.id : null,
            product_id: this.productDetails.id ? this.productDetails.id : null,
        };
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to deassign this joint attribute',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.http.post(environment.host + 'assignment/joint/deassignSingleAttribute', body).subscribe(async (res: any) => {
                    if (res.success) {
                        await this.clearAll();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                        await this.loadProductByID();
                    } else if (!res.success) {
                        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        });
    }















    //Images Section
    imagesDropDownList = [];
    imagesSelected = [];
    loadedImages = [];

    async loadImages() {
        try {
            this.http.get(environment.host + 'product-images/listImages').subscribe(async (res: any) => {
                res.success ? this.imagesDropDownList = res.data: this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async loadImageURL(e) {
        try {
            this.http.post(environment.host + 'product-images/imageUrls', { list: e }).subscribe(async (res: any) => {
                res.success ? this.loadedImages = res.data: this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async saveImageClick() {
        try {
            this.submitLoader = true;
            const body = {
                product_id: this.productDetails.id,
                images: this.imagesSelected
            };
            this.http.post(environment.host + 'product/assignImages', body).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({ title: 'Success', msg: 'Images assigned', type: 'success' });
                    this.submitLoader = false;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    this.submitLoader = false;
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }
    
}