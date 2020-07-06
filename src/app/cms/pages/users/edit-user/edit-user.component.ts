import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToasterService} from 'src/app/cms/services/toaster.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

    selectedUserType = '';
    userTypes = [
        {name: 'Admin'},
        {name: 'Member'}
    ];
    website: any;
    selectedWebsites = [];

    public submitLoader = false;
    public user: any;
    public isMember = true;

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toaster: ToasterService
    ) {

    }

    public editForm: FormGroup;

    ngOnInit() {
        this.submitLoader = false;
        this.getUserByID();
        this.editForm = this.formBuilder.group({
            id: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            name: ['', Validators.required],
            role: ['', Validators.required],
            websites: [''],
            active: [''],
            created_at: [''],
            updated_at: [''],
        });
        this.getAllWebSites();
    }


    async getUserByID() {
        this.http.get(environment.host + 'user/' + this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
                res.password = 'changeme';
                this.isMember = res.role === 'Admin' ? true : false;
                this.editForm.setValue(res);
                res.websites.forEach(item => {
                    this.selectedWebsites.push(
                        item
                    );
                });
            });

    }

    async onSubmit() {
        this.submitLoader = true;
        this.http.post(environment.host + 'user', this.editForm.value).subscribe((res: any) => {
                this.toaster.addToast({title: 'Success', msg: 'User Updated Successfully', type: 'success'});
                this.router.navigate(['public/view-user']);
            },
            (err: any) => {
                this.toaster.addToast({title: 'Error', msg: err.message, type: 'error'});
            });
    }

    onSelect() {
        if (this.selectedUserType === 'Member') {
            this.isMember = false;
        } else {
            this.editForm.controls.websites.setValue('');
            this.isMember = true;
        }
    }

    getAllWebSites() {
        this.http.get(environment.host + 'website').subscribe((res: any) => {
                this.website = res.data;
            },
            (err: any) => {
                this.toaster.addToast({title: 'Error', msg: err.message, type: 'error'});
            });
    }


}
