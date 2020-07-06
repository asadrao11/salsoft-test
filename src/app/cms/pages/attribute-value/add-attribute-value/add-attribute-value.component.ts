import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
  selector: 'app-add-attribute-value',
  templateUrl: './add-attribute-value.component.html',
  styleUrls: ['./add-attribute-value.component.scss']
})
export class AddAttributeValueComponent implements OnInit {

  attributeDropDown = [];
  categoryDropDown = [];
  valuesDropDown = [];
  formLoad = false;
  addForm: FormGroup;
  addDetailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToasterService,
    private router: Router,
    private uploaderService: UploaderService
  ) { }

  ngOnInit() {
    this.formLoad = false;
    this.addForm = this.formBuilder.group({
      values: [null, [Validators.required]]
    });
    this.addDetailForm = this.formBuilder.group({
      categories: [null, [Validators.required]],
      attributes: [null, [Validators.required]],
      values: [null, [Validators.required]],
    });
    this.getCategories();
    this.getAttributes();
    this.getValues();
  }


  async getCategories() {
    try {
      this.categoryDropDown = [];
      this.http.get(environment.host + 'category').subscribe((res: any) => {
        if (res.success) { this.categoryDropDown = res.data; this.formLoad = true; }
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async getAttributes() {
    try {
      this.attributeDropDown = [];
      this.http.get(environment.host + 'attribute').subscribe((res: any) => {
        if (res.success) { this.attributeDropDown = res.data; this.formLoad = true; }
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async getValues() {
    try {
      this.valuesDropDown = [];
      this.http.get(environment.host + 'attributeValue').subscribe((res: any) => {
        if (res.success) { this.valuesDropDown = res.data; }
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }


  async onSubmitValue() {
    try {
      this.toastr.addToast({ title: 'Please Wait', msg: "we are adding values to list", type: 'wait' });
      this.valuesDropDown = [];
      this.http.post(environment.host + 'attributeValue', this.addForm.value).subscribe((res: any) => {
        if (res.success) {
          this.addForm.reset();
          this.getValues();
          this.toastr.addToast({ title: 'Values added in dropdown', msg: res.message, type: 'success' });
        } else {
          this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
        }
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }



  async onSubmitDetails() {
    try {
      this.toastr.addToast({ title: 'Please Wait', msg: "Assigning values...", type: 'wait' });
      this.http.post(environment.host + 'attributeValue/assignValues', this.addDetailForm.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.addForm.reset();
          this.addDetailForm.reset();
        } else {
          this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
        }
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
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
        this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'attribute-values');
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










  //BULK Upload 2
  // Upload section
  public filename2 = 'Choose File';
  public fileAdded2 = false;
  public uploadDataReady2 = false;
  public dataForUploading2: any = [];
  public eventData2: any;

  handleFileInput2(e) {
    if (e.target.files.length === 1) {
      this.eventData2 = e;
      this.filename2 = e.target.files.item(0).name;
      this.fileAdded2 = true;
      this.uploadDataReady2 = false;
    } else {
      this.filename2 = 'Choose File';
      this.fileAdded2 = false;
      this.uploadDataReady2 = false;
      this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
    }
  }

  async fileUpload2() {
    try {
      if (this.fileAdded2) {
        this.dataForUploading2 = await this.uploaderService.read_Excel_File(this.eventData2.target.files[0], 'assign-values-to-attributes');
        if (this.dataForUploading2.length > 0) { this.uploadDataReady2 = true; }
      } else {
        this.filename2 = 'Choose File';
        this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
        this.uploadDataReady2 = false;
      }
    } catch (e) {
      this.uploadDataReady2 = false;
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }
}