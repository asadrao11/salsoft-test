import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
  selector: 'app-add-websites',
  templateUrl: './add-websites.component.html',
  styleUrls: ['./add-websites.component.scss']
})
export class AddWebsitesComponent implements OnInit {

  public addForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToasterService,
    private uploaderService: UploaderService
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      created_by: null,
      updated_by: null,
      active: null,
    });
  }

  async onSubmit() {
    const userID = localStorage.getItem('user');
    this.addForm.controls.created_by.setValue(userID);
    this.addForm.controls.updated_by.setValue(userID);
    this.http.post(environment.host + 'website', this.addForm.value).subscribe((res: any) => {
      if (res.success) {
        this.toastr.addToast({ title: 'Success', msg: 'Website added successfully', type: 'success' });
        this.router.navigate(['public/view-website']);
      } else {
        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
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
        this.dataForUploading = await this.uploaderService.read_Excel_File(this.eventData.target.files[0], 'websites');
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
