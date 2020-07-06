import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-edit-unit',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.scss']
})
export class EditUnitComponent implements OnInit {

    public submitLoader = false;
    public unitData: any;
    public selected = [];
    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // this.submitLoader = false;
    }

    editForm: FormGroup;
    attributeList: any;


    ngOnInit() {
        this.getUnitByID();
        this.getAllAttributes();
        this.editForm = this.formBuilder.group({
            id: [''],
            title: ['',
                [
                    Validators.required,
                ]
            ],
            short_code: ['',
                [
                    Validators.required,
                ]
            ],
            attributes: [''],
            active: [''],
            created_by: [''],
            updated_by: [''],
            created_at: [''],
            updated_at: [''],
            deleted: ['']
        });
    }

    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.editForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'unit', this.editForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({ title: 'Success', msg: 'Unit Updated Successfully', type: 'success'});
                    this.router.navigate(['public/view-units']);
                } else {
                    this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error'});

                }
            },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });

    }

    getAllAttributes() {
        this.http.get(environment.host + 'attribute').subscribe((res: any) => {
                this.attributeList = res.data;
            },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });

    }

    async getUnitByID() {
        this.http.get(environment.host + 'unit/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                if(res.success){
                this.unitData = res.data;
                this.editForm.setValue(res.data);
                this.editForm.controls.attributes.setValue(res.data.attributes);
                }
            });
    }

}
