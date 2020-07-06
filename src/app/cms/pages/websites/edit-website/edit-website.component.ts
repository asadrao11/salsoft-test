import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'

@Component({
  selector: 'app-edit-website',
  templateUrl: './edit-website.component.html',
  styleUrls: ['./edit-website.component.scss']
})
export class EditWebsiteComponent implements OnInit {

  user: any;
  editForm: FormGroup;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private toastr: ToasterService
    ) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      created_at: '',
      updated_at: '',
      created_by: '',
      updated_by: '',
      active: '',
      deleted: '',
      users: ['']
    });
    this.getWebsiteByID();
  }


  async getWebsiteByID() {
    this.http.get(environment.host + 'website/' + this.route.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
        this.editForm.setValue(res.data);
      });
  }

  async onSubmit() {
    this.editForm.patchValue({
      id: this.route.snapshot.paramMap.get('id')
    });
    
    this.http.post(environment.host + 'website', this.editForm.value).subscribe((res: any) => {
      if (res.success) {
        this.toastr.addToast({ title: 'Success', msg: 'Brand Updated successfully', type: 'success'});
          this.router.navigate(['public/view-website']);
      } else {
        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      }

    },
      (err: any) => {
        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
      });
  }

}
