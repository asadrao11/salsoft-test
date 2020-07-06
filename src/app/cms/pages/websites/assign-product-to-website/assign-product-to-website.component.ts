import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderService } from '../../../services/uploader.service';

@Component({
    selector: 'app-assign-product-to-website',
    templateUrl: './assign-product-to-website.component.html',
    styleUrls: ['./assign-product-to-website.component.scss']
})
export class AssignProductToWebsiteComponent implements OnInit {

    public currentWebsite: any;
    public productData: any;
    public productLoaded: boolean;
    public submitLoader: boolean;
    public addForm: FormGroup;

    crossReferenceDropDown = [];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService
    ) {
        this.submitLoader = false;
    }

    ngOnInit() {
        this.productLoaded = false;
        this.addForm = this.formBuilder.group({
            website_id: [''],
            product_id: [null, Validators.required],
            name: ['', Validators.required],
            SKU: ['', Validators.required],
            price: ['', Validators.required],
            cost: ['', Validators.required],
            qty: ['', Validators.required],
            cross_reference_id: ['',  Validators.required],
            cross_reference_check: [''],
            show_price: [''],
            is_in_stock: [''],
            active: [''],
        });
        this.loadProductDropBox();
    }

    async loadProductDropBox() {
        try {
            this.http.get(environment.host + 'cross-reference').subscribe(async (res: any) => {
                if (res.success) {
                  this.crossReferenceDropDown = res.data;
                } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
              });
            this.http.get(environment.host + 'product').subscribe(async (res: any) => {
                if (res.success) {
                    this.productData = res.data;
                    this.productLoaded = true;
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            });
            this.http.get(environment.host + `website/${this.route.snapshot.params.id}`).subscribe(async (res: any) => {
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

    async onSubmit() {
        this.submitLoader = true;
        this.addForm.controls.website_id.setValue(this.route.snapshot.params.id);
        this.http.post(environment.host + 'webProduct/assign', this.addForm.value).subscribe((res: any) => {
            this.submitLoader = false;
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Product assigned successfully', type: 'success' });
                this.addForm.reset();
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        },
            (err: any) => {
                this.submitLoader = false;
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
    }



    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;

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
                this.dataForUploading = await this.uploaderService.read_Excel_File(
                    this.eventData.target.files[0], 'assign-product-to-website'
                );
                if (this.dataForUploading.length > 0) {
                    this.uploadDataReady = true;
                }
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
