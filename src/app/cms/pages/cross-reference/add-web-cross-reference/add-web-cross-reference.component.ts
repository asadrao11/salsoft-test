import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UploaderService} from '../../../services/uploader.service';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from '../../../services/toaster.service';

@Component({
    selector: 'app-add-web-cross-reference',
    templateUrl: './add-web-cross-reference.component.html',
    styleUrls: ['./add-web-cross-reference.component.scss']
})
export class AddWebCrossReferenceComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService,
    ) {
    }

    public websiteDropDown: any;
    public crossRefDropDown: any;
    public crossRefLoading: boolean;
    public websiteLoading: boolean;

    public addForm: FormGroup;


    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;


    ngOnInit() {
        this.websiteLoading = true;
        this.crossRefLoading = true;
        this.getWebSiteDropDown();
        this.getCrossRefDropDown();
        this.addForm = this.formBuilder.group({
            website_id: [null, Validators.required],
            cross_reference_id: [null, Validators.required],
            price: ['', Validators.required],
        });
    }

    async onSubmit() {
        this.http.post(environment.host + 'cross-reference/web', this.addForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Web Cross Reference Added Successfully', type: 'success'});
                    this.router.navigate(['public/view-web-cross-reference']);
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

    getWebSiteDropDown() {
        this.http.get(environment.host + 'website').subscribe((res: any) => {
            if (res.success) {
                this.websiteDropDown = res.data;
                this.websiteLoading = false;
            }
        });
    }

    getCrossRefDropDown() {
        this.http.get(environment.host + 'cross-reference').subscribe((res: any) => {
            if (res.success) {
                this.crossRefDropDown = res.data;
                this.crossRefLoading = false;
            }
        });
    }
}
