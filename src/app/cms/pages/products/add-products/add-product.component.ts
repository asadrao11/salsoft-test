import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderService } from 'src/app/cms/services/uploader.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService
    ) { }

    editForm: FormGroup;
    categoryDropDown: any;
    brandDropDown: any;

    filename = 'Choose File';
    fileAdded = false;
    uploadDataReady = false;
    dataForUploading: any = [];
    eventData: any;

    
    //Normal methods
    ngOnInit() {
        this.editForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            category_id: [null, Validators.required],
            brand_id: [null, Validators.required],
            SKU: ['', Validators.required],
            description: ['', Validators.required],
            active: [''],
            created_by: [''],
            updated_by: [''],
        });
        this.loadCategoryDropBox();
        this.loadBrandDropBox();
    }

    async loadCategoryDropBox() {
        try {
            this.http.get(environment.host + 'category').subscribe(async (res: any) => {
                if (res.success) {
                    this.categoryDropDown = res.data;
                }
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
                }
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.editForm.controls.created_by.setValue(userID);
        this.editForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'product', this.editForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Product added successfully', type: 'success' });
                this.router.navigate(['public/assign-attribute-product', res.data.id]);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
    }



    
    // Bulk upload section
    handleFileInput(e) {
        if (e.target.files.length === 1) {
            this.eventData = e;
            this.filename = e.target.files.item(0).name;
            this.fileAdded = true;
            this.uploadDataReady = false;
        } else {
            this.filename = 'Choose File';
            this.fileAdded = false;
            this.uploadDataReady = false;
            this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
        }
    }

    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'products');
                if (this.dataForUploading.length > 0) { this.uploadDataReady = true; }
            } else {
                this.filename = 'Choose File';
                this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
                this.uploadDataReady = false;
            }
        } catch (e) {
            this.uploadDataReady = false;
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    startUploading() {
        this.uploaderService.start_Upload();
    }
}
