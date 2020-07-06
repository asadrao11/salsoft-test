import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {ToasterService} from 'src/app/cms/services/toaster.service';
import {environment} from 'src/environments/environment';
import {UploaderService} from 'src/app/cms/services/uploader.service';

@Component({
    selector: 'app-add-cross-reference',
    templateUrl: './add-cross-reference.component.html',
    styleUrls: ['./add-cross-reference.component.scss']
})
export class AddCrossReferenceComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService,
    ) {
    }

    public addForm: FormGroup;


    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;


    ngOnInit() {
        this.addForm = this.formBuilder.group({
            item_number: ['', Validators.required],
            description: ['']
        });
    }

    async onSubmit() {
        this.http.post(environment.host + 'cross-reference', this.addForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Cross Reference Added Successfully', type: 'success'});
                    this.router.navigate(['public/view-cross-reference']);
                } else {
                    this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});
                }
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
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
            this.toastr.addToast({title: 'Error', msg: 'Please select a file', type: 'error'});
        }
    }

    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'brands');
                if (this.dataForUploading.length > 0) { this.uploadDataReady = true; }
            } else {
                this.filename = 'Choose File';
                this.toastr.addToast({title: 'Error', msg: 'Please select a file', type: 'error'});
                this.uploadDataReady = false;
            }
        } catch (e) {
            this.uploadDataReady = false;
            this.toastr.addToast({title: 'Error', msg: e.message, type: 'error'});
        }
    }

    startUploading() {
        this.uploaderService.start_Upload();
    }
}
