import {AfterViewInit, Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-edit-cross-reference-details',
  templateUrl: './edit-cross-reference-details.component.html',
  styleUrls: ['./edit-cross-reference-details.component.scss']
})
export class EditCrossReferenceDetailsComponent implements OnInit, AfterViewInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService
    ) {

    }

    public brandDropDown: any;
    public websiteDropDown: any;
    public crossRefDropDown: any;
    public crossRefLoading: boolean;
    public websiteLoading: boolean;
    public brandLoading: boolean;

    public crossReferenceDetailsForm: FormGroup;


    ngOnInit() {

        this.crossReferenceDetailsForm = this.formBuilder.group({
            id: [''],
            website_id: [null, Validators.required],
            cross_reference_id: [null, Validators.required],
            brand_id: [null, Validators.required],
            ratio: ['', Validators.required],
            calculated_amount: [''],
            created_at: [''],
            updated_at: [''],
            deleted: ['']
        });

        this.websiteLoading = true;
        this.crossRefLoading = true;
        this.brandLoading = true;

        this.loadData();

    }

    ngAfterViewInit() {



    }



    getCrossReferenceDetails() {
        this.http.get(environment.host + 'cross-reference/details/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.crossReferenceDetailsForm.setValue(res.data);
                this.crossReferenceDetailsForm.controls.website_id.setValue(res.data.website_id);
                this.crossReferenceDetailsForm.controls.cross_reference_id.setValue(res.data.cross_reference_id);
                this.crossReferenceDetailsForm.controls.brand_id.setValue(res.data.brand_id);
            });

    }

    async onSubmit() {
        this.http.post(environment.host + 'cross-reference/details', this.crossReferenceDetailsForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Web Cross Reference Detail Updated Successfully', type: 'success'});
                    this.router.navigate(['public/view-cross-reference-details']);
                } else {
                    this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});

                }
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
            });

    }

    async loadData() {
        this.http.get(environment.host + 'cross-reference/details-website').subscribe((res: any) => {
            if (res.success) {
                this.websiteDropDown = res.data;
                this.websiteLoading = false;
            }
        });

        this.http.get(environment.host + 'cross-reference/details-cross_ref').subscribe((res: any) => {
            if (res.success) {
                this.crossRefDropDown = res.data;
                this.crossRefLoading = false;
            }

            this.getCrossReferenceDetails();
        });

        this.http.get(environment.host + 'brand').subscribe(async (res: any) => {
            if (res.success) {
                this.brandDropDown = res.data;
                this.brandLoading = false;
            }
        });


    }

}
