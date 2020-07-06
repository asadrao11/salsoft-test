import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { Router } from '@angular/router';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

    public editForm: FormGroup;
    public categoryDropDown: any;
    
    constructor(
        private http: HttpClient,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToasterService,
        private uploaderService: UploaderService
        ) { }

    ngOnInit() {
        this.editForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            active: [''],
            created_by: [''],
            updated_by: [''],
            parent_id: [null, Validators.required],
        });
        this.loadCategoryDropBox();
    }

    async loadCategoryDropBox() {
        this.categoryDropDown = [];
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


    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.editForm.controls.created_by.setValue(userID);
        this.editForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'category', this.editForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Category Added Successfully', type: 'success' });
                this.router.navigate(['public/view-categories']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
    }

    // selectedCat(eventVal) {
    //     this.editForm.controls.parent_id.setValue(eventVal.target.value);
    // }






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
        this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'categories');
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
