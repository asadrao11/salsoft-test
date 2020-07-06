import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service';


@Component({
    selector: 'app-add-attribute',
    templateUrl: './add-attribute.component.html',
    styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit {

    public selectedAttributeGroup = [];
    public selectedAttributeType = [];
    isHide = true;
    addForm: FormGroup;
    attributeGroupDropDown: any;
    attributeTypeDropDown = [
        { type: 'TextBox' },
        { type: 'RichTextBox' },
        { type: 'Radio' },
        { type: 'DropDown' },
        { type: 'Multi-Select-DropDown' },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private uploaderService: UploaderService
    ) { }

    ngOnInit() {
        this.getAllGroupAttributes();
        this.addForm = this.formBuilder.group({
            title: [null, Validators.required],
            short_code: [null, Validators.required],
            is_filter: [null],
            type: [null, Validators.required],
            attributeGroups: [null, Validators.required],
            active: [null],
            created_by: [null],
            updated_by: [null],
        });
    }

    async onSubmit() {
        this.addForm.controls.type.setValue(this.addForm.controls.type.value.type);
        const userID = localStorage.getItem('user');
        this.addForm.controls.created_by.setValue(userID);
        this.addForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'attribute', this.addForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Attribute Added Successfully', type: 'success' });
                this.router.navigate(['public/view-attributes']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    async getAllGroupAttributes() {
        this.http.get(environment.host + 'attributeGroup').subscribe((res: any) => {
            this.attributeGroupDropDown = res.data;
        }, (err: any) => {
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
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'attributes');
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