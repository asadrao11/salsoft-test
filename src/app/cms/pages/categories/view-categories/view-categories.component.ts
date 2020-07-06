import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { Router } from '@angular/router';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-view-categories',
    templateUrl: './view-categories.component.html',
    styleUrls: ['./view-categories.component.scss']
})
export class ViewCategoriesComponent implements OnInit {

    categories: any;
    dataLoaded = false;
    selectedCategory = '';

    configs: any = {
        id_field: 'id',
        parent_id_field: 'parent_id',
        parent_display_field: 'name',
        css: {
            expand_class: 'fa fa-caret-right',
            collapse_class: 'fa fa-caret-down',
        },
        columns: [
            {
                name: 'title',
                header: 'Name',
            }
        ]
    };


    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToasterService
    ) {
        this.dataLoaded = false;
        this.getCategories();

    }

    ngOnInit() {

    }

    async getCategories() {
        this.http.get(environment.host + 'category/all').subscribe((res: any) => {
            console.log(res);
            if (res.success) {
                this.categories = res.data;
                this.dataLoaded = true;
            } else {
                this.dataLoaded = true;
                this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }
        }, (err: any) => {
            this.dataLoaded = true;
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }

    deleteCategory(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.http.delete(environment.host + 'category/' + id).subscribe((res: any) => {
                    this.getCategories();
                    this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                },
                    (err: any) => {
                        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                    });
            }
        });
    }

    onCategoryClick(event){
        this.selectedCategory = event.itemData.name;
    }
}