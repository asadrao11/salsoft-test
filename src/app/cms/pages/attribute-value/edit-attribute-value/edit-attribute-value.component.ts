import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
  selector: 'app-edit-attribute-value',
  templateUrl: './edit-attribute-value.component.html',
  styleUrls: ['./edit-attribute-value.component.scss']
})
export class EditAttributeValueComponent implements OnInit {

  type: string;
  attributeValueID: string;
  formLoad = false;

  attributeDropDown = [];
  categoryDropDown = [];
  valuesDropDown = [];
  editValueForm: FormGroup;
  editGroupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.formLoad = false;
    this.attributeValueID = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type === "value") {
      this.editValueForm = this.formBuilder.group({
        id: [],
        value: [null, [Validators.required]],
        created_at: [''],
        updated_at: ['']
      });
      this.getAttributeValueByID();
    } else if (this.type === "group") {
      this.editGroupForm = this.formBuilder.group({
        id: [null],
        categories: [null, [Validators.required]],
        attributes: [null, [Validators.required]],
        value: [null, [Validators.required]],
      });
      await this.getCategories();
      await this.getAttributes();
      await this.getGroupByID();
    }
  }

  async getCategories() {
    try {
      this.http.get(environment.host + 'category').subscribe((res: any) => {
        if (res.success) { this.categoryDropDown = res.data; }
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
      this.http.get(environment.host + 'attribute').subscribe((res: any) => {
        if (res.success) this.attributeDropDown = res.data;
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


  async getAttributeValueByID() {
    try {
      this.http.get(environment.host + 'attributeValue/single/' + this.attributeValueID).subscribe((res: any) => {
        if (res.success) {
          this.editValueForm.setValue(res.data);
          this.formLoad = true;
        }
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async getGroupByID() {
    try {
      this.http.get(environment.host + 'attributeValue/' + this.attributeValueID).subscribe(async (res: any) => {
        if (res.success) {
          this.editGroupForm.controls.id.setValue(res.data.id);
          this.editGroupForm.controls.value.setValue(res.data.value);
          const cats = Object.values(res.data.categories).map((value: any) => value.id);
          this.editGroupForm.controls.categories.setValue([...new Set(cats)]);
          const atts = Object.values(res.data.attributes).map((value: any) => value.id);
          this.editGroupForm.controls.attributes.setValue([...new Set(atts)]);
          this.formLoad = true;
        }
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }


  async onValueSubmit() {
    try {
      this.toastr.addToast({ title: 'Please Wait', msg: "Updating value", type: 'wait' });
      this.http.post(environment.host + 'attributeValue', this.editValueForm.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.router.navigate(['public/view-attribute-value']);
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

  async onGroupSubmit() {
    try {
      this.toastr.addToast({ title: 'Please Wait', msg: "Assigning values...", type: 'wait' });
      this.http.post(environment.host + 'attributeValue/updateAssignedValues', this.editGroupForm.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.router.navigate(['public/view-attribute-value']);
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
}