import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'

@Component({
  selector: 'app-update-prices',
  templateUrl: './update-prices.component.html',
  styleUrls: ['./update-prices.component.scss']
})
export class UpdatePricesComponent implements OnInit {

  updateForm: FormGroup;
  crossReferenceDropDown = [];
  websiteDropDown = [];
  extracted_CrossRefDetails = [];
  submitLoader = false;
  dataExtracted = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToasterService
  ) { }

  ngOnInit() {
  this.dataExtracted = false;
    this.updateForm = this.formBuilder.group({
      cross_reference_id: [null, Validators.required],
      website_id: [null, Validators.required],
    });
    this.loadPage();
  }

  async loadPage() {
    try {
      this.toastr.addToast({ title: 'Please Wait', msg: 'Data is loading...', type: 'wait' });
      this.http.get(environment.host + 'cross-reference').subscribe(async (res: any) => {
        if (res.success) {
          this.crossReferenceDropDown = res.data;
        } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
      });
      this.http.get(environment.host + 'website').subscribe(async (res: any) => {
        if (res.success) {
          this.websiteDropDown = res.data;
        } else { this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' }); }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  onProcessClick() {
    try {
      this.dataExtracted = false;
      this.toastr.addToast({ title: 'Please Wait', msg: 'Data is loading...', type: 'wait' });
      this.http.post(environment.host + 'cross-reference/update-price/getCrossReferenceDetails', this.updateForm.value).subscribe(async (res: any) => {
        if (res.success) {
          this.extracted_CrossRefDetails = res.data;
          this.dataExtracted = true;
        } else {
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
        }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }


  async onUpdateClick() {
    try {
      this.submitLoader = true;
      this.toastr.addToast({ title: 'Please Wait', msg: 'Data is loading...', type: 'wait' });
      this.http.post(environment.host + 'cross-reference/update-price/updatePrice', { data: this.extracted_CrossRefDetails }).subscribe(async (res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.submitLoader = false;
          this.dataExtracted = false;
          this.extracted_CrossRefDetails = [];
          this.updateForm.reset();
        } else {
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
        }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

}
