import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-view-products-website',
    templateUrl: './view-products-website.component.html',
    styleUrls: ['./view-products-website.component.scss']
})
export class ViewProductsWebsiteComponent implements OnInit {

    websites: any;
    products: any;
    webId: any;
    dataLoaded = true;
    siteSelected = false;
    public websiteLoaded: boolean;


    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToasterService
    ) {
        this.dataLoaded = false;
    }

    ngOnInit() {
        this.websiteLoaded = false;
        this.getWebsite();
    }

    async getWebsite() {
        this.http.get(environment.host + 'website').subscribe((res: any) => {
            if (res.success) {
                this.websites = res.data;
                this.websiteLoaded = true;
            }
        });
    }

    async getProducts(e) {
        if (e.id) {
            const websiteId = e.id;
            this.siteSelected = true;
            this.dataLoaded = false;
            this.webId = websiteId;
            this.http.get(environment.host + 'website/' + websiteId + '/products').subscribe((res: any) => {
                console.log(res);
                if (res.success) {
                    this.products = res.data;
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
    }

    deassignProduct(productId) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                const formData = new FormData();
                formData.append('website_id', this.webId);
                formData.append('product_id', productId);
                this.http.post(environment.host + 'webProduct/deassign', formData).subscribe((res: any) => {
                    this.getProducts(this.webId);
                    this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                },
                    (err: any) => {
                        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                    });
            }
        });
    }
}
