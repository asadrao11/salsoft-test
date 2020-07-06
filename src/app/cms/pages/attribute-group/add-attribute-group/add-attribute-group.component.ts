import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
    selector: 'app-add-attribute-group',
    templateUrl: './add-attribute-group.component.html',
    styleUrls: ['./add-attribute-group.component.scss']
})
export class AddAttributeGroupComponent implements OnInit {

    addAttributeGroupForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private uploaderService: UploaderService
    ) {
    }

    ngOnInit() {
        this.addAttributeGroupForm = this.formBuilder.group({
            name: ['',
                [
                    Validators.required
                ]
            ],
            active: [''],
            created_by: [''],
            updated_by: ['']
        });
    }

    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.addAttributeGroupForm.controls.created_by.setValue(userID);
        this.addAttributeGroupForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'attributeGroup', this.addAttributeGroupForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Attribute Group add successfully', type: 'success' });
                this.router.navigate(['public/view-attribute-group']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });

            }
        },
            (err: any) => {
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
        if (e.target.files.length == 1) {
            this.eventData = e;
            this.filename = e.target.files.item(0).name;
            this.fileAdded = true;
            this.uploadDataReady = false;
        } else {
            this.filename = 'Choose File'
            this.fileAdded = false;
            this.uploadDataReady = false;
            this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
        }
    }

    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'attribute-groups');
                if (this.dataForUploading.length > 0) this.uploadDataReady = true;
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
