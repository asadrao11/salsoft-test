import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploaderService } from '../../../services/uploader.service';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'app-add-unit',
    templateUrl: './add-unit.component.html',
    styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {

    public selected = [];
    addForm: FormGroup;
    attributesDropDown: any;
    isHide = true;

    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private uploaderService: UploaderService
    ) {
    }

    ngOnInit() {
        this.getAllAttributes();
        this.addForm = this.formBuilder.group({
            title: ['',
                [
                    Validators.required,
                ]
            ],
            short_code: ['',
                [
                    Validators.required,
                ]
            ],
            attributes: ['', Validators.required],
            active: [''],
            created_by: [''],
            updated_by: [''],
        });
    }

    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.addForm.controls.created_by.setValue(userID);
        this.addForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'unit', this.addForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Unit Added Successfully', type: 'success' });
                this.router.navigate(['public/view-units']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async getAllAttributes() {
        this.http.get(environment.host + 'attribute').subscribe((res: any) => {
            this.attributesDropDown = res.data;

        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


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
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'units');
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
