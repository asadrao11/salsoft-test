import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {

  user: any;
  editForm: FormGroup;
  selectedLogo = null;
  selectedLogoName = "Select Logo";
  imagePath = "./../../../../../assets/images/no-image.png";
  submitLoader = false;

  imageUpdated = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private toastr: ToasterService,
    ) { }

  ngOnInit() {
    this.getBrandByID();
    this.editForm = this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      imageUrl: null,
      created_at: null,
      updated_at: null,
      created_by: null,
      updated_by: null,
      active: null,
      deleted: null,
    });
  }


  async reload() {
    this.selectedLogo = null;
    this.selectedLogoName = "Select Logo";
    this.imagePath = "./../../../../../assets/images/no-image.png";
    this.submitLoader = false;
    this.editForm.reset();
  }

  async getBrandByID() {
    this.http.get(environment.host + 'brand/' + this.route.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
        if(res.success) {
          this.editForm.setValue(res.data);
          if(res.data.imageUrl) {
            this.imagePath = res.data.imageUrl;
            this.selectedLogoName = (res.data.imageUrl.replace(/^.*[\\\/]/, '')).split('?',1);
          }
        } 
      });
  }

  async onSubmit() {
    this.submitLoader = true;

    this.editForm.patchValue({
      id: this.route.snapshot.paramMap.get('id')
    });
    this.http.post(environment.host + 'brand', this.editForm.value).subscribe((res: any) => {
      if (res.success) {
        if(this.imageUpdated) {
          this.http.delete(environment.host + 'brand/removeLogo/' + res.data.id).subscribe((res2: any) => {
            if(res2.success) {

              this.toastr.addToast({ title: 'Please wait', msg: 'Uploading logo', type: 'wait' });
              const logo = new FormData();
              logo.append('logo', this.selectedLogo, this.selectedLogoName);
              this.http.post(environment.host + 'brand/uploadLogo/'+res.data.id, logo).subscribe((res2: any) => {
                  if(res2.success) this.toastr.addToast({ title: 'Success', msg: 'Brand Added Successfully', type: 'success' });
                  else this.toastr.addToast({ title: 'Upload Error', msg: res.error, type: 'error' });
                  this.reload();
               });

            } else this.toastr.addToast({ title: 'Upload Error', msg: res.error, type: 'error' });
         });

    
        } else {
          this.submitLoader = false;
          this.router.navigate(['public/view-brands']);
        }
      } else {
        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }
    }, (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
  }


  logoInput(e) {
    this.selectedLogo = e.target.files[0];
    if (this.selectedLogo) {
      this.imageUpdated = true;
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedLogo);
      this.selectedLogoName = e.target.files[0].name;      
    } else {
      this.imageUpdated = false;
    }
  }

  handleReaderLoaded(e) {
    this.imagePath = 'data:image/png;base64,' + btoa(e.target.result);
  }


}
