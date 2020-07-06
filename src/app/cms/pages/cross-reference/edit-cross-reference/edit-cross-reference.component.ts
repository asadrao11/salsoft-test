import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-edit-cross-reference',
  templateUrl: './edit-cross-reference.component.html',
  styleUrls: ['./edit-cross-reference.component.scss']
})
export class EditCrossReferenceComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToasterService
    ) {

    }

    public editCrossReferenceForm: FormGroup;


    ngOnInit() {
        this.getCrossReference();
        this.editCrossReferenceForm = this.formBuilder.group({
            id: [''],
            item_number: ['',
                [
                    Validators.required
                ]
            ],
            description: ['', Validators.required],
            created_at: [''],
            updated_at: [''],
            deleted: ['']
        });
    }

    async getCrossReference() {
        this.http.get(environment.host + 'cross-reference/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                this.editCrossReferenceForm.setValue(res.data);
            });

    }

    async onSubmit() {
        this.http.post(environment.host + 'cross-reference', this.editCrossReferenceForm.value).subscribe((res: any) => {
                if (res.success) {
                    this.toastr.addToast({title: 'Success', msg: 'Cross Reference Updated Successfully', type: 'success'});
                    this.router.navigate(['public/view-cross-reference']);
                } else {
                    this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});

                }
            },
            (err: any) => {
                this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
            });

    }

}
