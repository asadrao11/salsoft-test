import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToasterService} from 'src/app/cms/services/toaster.service'

@Component({
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
    user: any;
    editForm: FormGroup;
    categoryDropDown: any[];

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private toastr: ToasterService) {

    }

    ngOnInit() {
        this.getCategoryById();
        this.editForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            created_at: '',
            updated_at: '',
            parent_id: null,
            created_by: '',
            updated_by: '',
            active: '',
            deleted: '',
        });
        this.loadCategoryDropBox();
    }


    async getCategoryById() {
        this.http.get(environment.host + 'category/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.editForm.setValue(res.data);
            });
    }

    async onSubmit() {
        this.editForm.patchValue({
            id: this.route.snapshot.paramMap.get('id')
        });
        this.http.post(environment.host + 'category', this.editForm.value).subscribe((res: any) => {
                this.toastr.addToast({title: 'Success', msg: 'Category edited successfully', type: 'success'});
                this.router.navigate(['public/index-categories']);
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
            });
    }

    async loadCategoryDropBox() {
        this.categoryDropDown = [];
        try {
            this.http.get(environment.host + 'category').subscribe(async (res: any) => {
                if (res.success) {
                    this.categoryDropDown = res.data;

                }
            });
        } catch (e) {
            this.toastr.addToast({title: 'Error', msg: e.message, type: 'error'});
        }
    }


}
