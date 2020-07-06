import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToasterService } from 'src/app/cms/services/toaster.service'
import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service'

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  public editForm: FormGroup;
  public selectedLogo = null;
  public selectedLogoName = "Select Logo";
  public imagePath = "./../../../../../assets/images/no-image.jpg";
  public submitLoader = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToasterService,
    private uploaderService: UploaderService,
  ) { }


  async reload() {
    this.selectedLogo = null;
    this.selectedLogoName = "Select Logo";
    this.imagePath = "./../../../../../assets/images/no-image.jpg";
    this.submitLoader = false;
    this.editForm.reset();
  }


  ngOnInit() {
    this.editForm = this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      active: null,
    });
    this.submitLoader = false;
  }

  async onSubmit() {
    this.submitLoader = true;
    this.http.post(environment.host + 'brand', this.editForm.value).subscribe((res: any) => {
      if (res.success) {
        if(this.selectedLogo) {
          this.toastr.addToast({ title: 'Please wait', msg: 'Uploading logo', type: 'wait' });
          const logo = new FormData();
          logo.append('logo', this.selectedLogo, this.selectedLogoName);
          this.http.post(environment.host + 'brand/uploadLogo/'+res.data.id, logo).subscribe((res2: any) => {
              if(res2.success) this.toastr.addToast({ title: 'Success', msg: 'Brand Added Successfully', type: 'success' });
              else this.toastr.addToast({ title: 'Upload Error', msg: res.error, type: 'error' });
              this.reload();
           });
        } else {
          this.submitLoader = false;
          this.router.navigate(['public/view-brands']);
        }
      } else {
        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
        this.submitLoader = false;
      }
    },(err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
    });
  }



  // Picture Upload
  logoInput(e) {
    this.selectedLogo = e.target.files[0];
    if (this.selectedLogo) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedLogo);
      this.selectedLogoName = e.target.files[0].name;      
    }
  }

  handleReaderLoaded(e) {
    this.imagePath = 'data:image/png;base64,' + btoa(e.target.result);
  }





  // Picture Upload Section
  // public filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));
  // public pictureFormGroup = new FormGroup({
  //   files: this.filesControl
  // });

  // public toggleStatus() {
  //   this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
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
        this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'brands');
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
