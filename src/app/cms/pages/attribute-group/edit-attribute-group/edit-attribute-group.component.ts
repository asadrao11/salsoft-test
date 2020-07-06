import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {async} from '@angular/core/testing';
import {environment} from 'src/environments/environment';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToasterService} from 'src/app/cms/services/toaster.service';

@Component({
    selector: 'app-edit-attribute-group',
    templateUrl: './edit-attribute-group.component.html',
    styleUrls: ['./edit-attribute-group.component.scss']
})
export class EditAttributeGroupComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService
    ) {

    }

    public editAttributeGroupForm: FormGroup;


    ngOnInit() {
        this.getAttributeGroup();
        this.editAttributeGroupForm = this.formBuilder.group({
            id: [''],
            name: ['',
                [
                    Validators.required
                ]
            ],
            active: [''],
            created_by: [''],
            updated_by: [''],
            created_at: [''],
            updated_at: [''],
            deleted: ['']
        });
    }

    async getAttributeGroup() {
        this.http.get(environment.host + 'attributeGroup/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.editAttributeGroupForm.setValue(res.data);
            });

    }

    async onSubmit() {
        const userID = localStorage.getItem('user');
        this.editAttributeGroupForm.controls.created_by.setValue(userID);
        this.editAttributeGroupForm.controls.updated_by.setValue(userID);
        this.editAttributeGroupForm.controls.updated_by.setValue(userID);
        this.http.post(environment.host + 'attributeGroup', this.editAttributeGroupForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Attribute Group Updated Successfully', type: 'success'});
                    this.router.navigate(['public/view-attribute-group']);
                } else {
                    this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});

                }
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
            });

    }

}
