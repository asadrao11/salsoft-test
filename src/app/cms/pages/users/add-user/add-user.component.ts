import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ToasterService} from 'src/app/cms/services/toaster.service';
import {Router} from '@angular/router';
import {UploaderService} from 'src/app/cms/services/uploader.service';
@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

    public selectedUserType = '';
    public website: any;
    public userTypes = [
            {name: 'Admin'},
            {name: 'Member'}
        ]
    public selectedWebsites = [];
    public addForm: FormGroup;
    public is_hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toaster: ToasterService,
        private router: Router,
        private uploaderService: UploaderService,
    ) { }  

    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            email: ['',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(8)
                ]
            ],
            name: ['', Validators.required],
            role: ['', Validators.required],
            websites: [''],
            active: ['']
        });
        this.getAllWebSites();
    }

    async onSubmit() {
        this.http.post(environment.host + 'user', this.addForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toaster.addToast({title: 'Success', msg: 'User Added Successfully', type: 'success'});
                    this.router.navigate(['public/view-user']);
                } else {
                    this.toaster.addToast({title: 'Error', msg: res.error, type: 'error'});
                }
            },
            (err: any) => {
                this.toaster.addToast({title: 'Error', msg: err.message, type: 'error'});
            });

    }

    getAllWebSites() {
        this.http.get(environment.host + 'website').subscribe((res: any) => {
                this.website = res.data;
            },
            (err: any) => {
                this.toaster.addToast({title: 'Error', msg: err.message, type: 'error'});
            });
    }

    onSelect() {
        if (this.selectedUserType === 'Member') {
            this.is_hide = false;
        } else {
            this.addForm.controls.websites.setValue('');
            this.is_hide = true;
        }
    }

    handleFileInput(e) {
        if (e.target.files.length === 1) {
            this.eventData = e;
            this.filename = e.target.files.item(0).name;
            this.fileAdded = true;
            this.uploadDataReady = false;
        } else {
            this.fileAdded = false;
            this.uploadDataReady = false;
            this.toaster.addToast({title: 'Error', msg: 'Please select a file', type: 'error'});
        }
    }

    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'users');
                if (this.dataForUploading.length > 0) {
                    this.uploadDataReady = true;
                }
            } else {
                this.filename = 'Choose File';
                this.toaster.addToast({title: 'Error', msg: 'Please select a file', type: 'error'});
                this.uploadDataReady = false;
            }
        } catch (e) {
            this.uploadDataReady = false;
            this.toaster.addToast({title: 'Error', msg: e.message, type: 'error'});
        }
    }

    startUploading() {
        this.uploaderService.start_Upload();
    }
}
