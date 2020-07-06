import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-edit-web-cross-reference',
  templateUrl: './edit-web-cross-reference.component.html',
  styleUrls: ['./edit-web-cross-reference.component.scss']
})
export class EditWebCrossReferenceComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService
    ) {

    }

    public websiteDropDown: any;
    public crossRefDropDown: any;
    public crossRefLoading: boolean;
    public websiteLoading: boolean;

    public webCrossReferenceForm: FormGroup;


    ngOnInit() {
        this.getWebCrossReference();
        this.webCrossReferenceForm = this.formBuilder.group({
            id: [''],
            website_id: [null,
                [
                    Validators.required
                ]
            ],
            cross_reference_id: [null, Validators.required],
            price: ['', Validators.required],
            created_at: [''],
            updated_at: [''],
            deleted: ['']
        });

        this.websiteLoading = true;
        this.crossRefLoading = true;

        this.getWebSiteDropDown();
        this.getCrossRefDropDown();
    }

    async getWebCrossReference() {
        this.http.get(environment.host + 'cross-reference/web/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.webCrossReferenceForm.setValue(res.data);
                this.webCrossReferenceForm.controls.website_id.setValue(res.data.website_id);
                this.webCrossReferenceForm.controls.cross_reference_id.setValue(res.data.cross_reference_id);
            });

    }

    async onSubmit() {
        this.http.post(environment.host + 'cross-reference/web', this.webCrossReferenceForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Web Cross Reference Updated Successfully', type: 'success'});
                    this.router.navigate(['public/view-web-cross-reference']);
                } else {
                    this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});

                }
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
            });

    }

    getWebSiteDropDown() {
        this.http.get(environment.host + 'website').subscribe((res: any) => {
            if (res.success) {
                this.websiteDropDown = res.data;
                this.websiteLoading = false;
            }
        });
    }

    getCrossRefDropDown() {
        this.http.get(environment.host + 'cross-reference').subscribe((res: any) => {
            if (res.success) {
                this.crossRefDropDown = res.data;
                this.crossRefLoading = false;
            }
        });
    }

}
