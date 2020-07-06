import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ToasterService} from 'src/app/cms/services/toaster.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UploaderService} from 'src/app/cms/services/uploader.service';
import {environment} from 'src/environments/environment';

@Component({
    selector: 'app-add-cross-reference-details',
    templateUrl: './add-cross-reference-details.component.html',
    styleUrls: ['./add-cross-reference-details.component.scss']
})
export class AddCrossReferenceDetailsComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService,
    ) {
    }

    public addForm: FormGroup;

    public crossReferenceDropDown = [];
    public websiteDropDown = [];
    public brandDropDown = [];


    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;


    ngOnInit() {
        this.addForm = this.formBuilder.group({
            cross_reference_id: [null, Validators.required],
            website_id: [null, Validators.required],
            brand_id: [null, Validators.required],
            ratio: ['', Validators.required],
        });
        this.loadPage();
    }

    loadPage() {
        try {
            this.toastr.addToast({title: 'Please Wait', msg: 'Data is loading...', type: 'wait'});
            this.http.get(environment.host + 'cross-reference/details-cross_ref').subscribe(async (res: any) => {
                if (res.success) {
                    this.crossReferenceDropDown = res.data;
                } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
            });
            this.http.get(environment.host + 'cross-reference/details-website').subscribe(async (res: any) => {
                if (res.success) {
                    this.websiteDropDown = res.data;
                } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
            });
            this.http.get(environment.host + 'brand').subscribe(async (res: any) => {
                if (res.success) {
                    this.brandDropDown = res.data;
                } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
            });
        } catch (e) {
            this.toastr.addToast({title: 'Error', msg: e.message, type: 'error'});
        }
    }


    async onSubmit() {
        this.http.post(environment.host + 'cross-reference/details', this.addForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Cross Reference Detail Added Successfully', type: 'success'});
                    this.router.navigate(['public/view-cross-reference-details']);
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
                if (this.dataForUploading.length > 0) {
                    this.uploadDataReady = true;
                }
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
