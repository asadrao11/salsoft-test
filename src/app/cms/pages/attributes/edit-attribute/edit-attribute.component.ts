import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-edit-attribute',
    templateUrl: './edit-attribute.component.html',
    styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnInit {

    public attributeData: any;
    public selectedType;
    editForm: FormGroup;
    attributeGroupList: any;
    attributeTypeDropDown = [
        { type: 'TextBox' },
        { type: 'RichTextBox' },
        { type: 'Radio' },
        { type: 'DropDown' },
        { type: 'Multi-Select-DropDown' },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getAttributeByID();
        this.getAllGroupAttributes();
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
            type: [''],
            units: [''],
            values: [''],
            is_filter: [''],
            attributeGroups: [''],
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
        this.http.post(environment.host + 'attribute', this.editForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: 'Attribute Updated Successfully', type: 'success' });
                this.router.navigate(['public/view-attributes']);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });

            }
        },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });

    }

    getAllGroupAttributes() {
        this.http.get(environment.host + 'attribute/groups').subscribe((res: any) => {
            this.attributeGroupList = res;
        },
            (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });

    }

    async getAttributeByID() {
        this.selectedType = [];
        this.http.get(environment.host + 'attribute/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.attributeData = res.data;
                this.editForm.setValue(res.data);
                this.editForm.controls.attributeGroups.setValue(res.data.attributeGroups);
                this.selectedType = res.data.type;
            });
    }

}
