import {Component, OnInit, AfterViewInit, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {ToasterService} from 'src/app/cms/services/toaster.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-view-cross-reference-details',
    templateUrl: './view-cross-reference-details.component.html',
    styleUrls: ['./view-cross-reference-details.component.scss']
})
export class ViewCrossReferenceDetailsComponent implements AfterViewInit, OnInit {

    dtOptions: any;

    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private renderer: Renderer2,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.initDataTable();
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute('edit_tag')) {
                const id = event.target.getAttribute('edit_tag');
                this.router.navigate(['/public/edit-cross-reference-details', id]);
            } else if (event.target.hasAttribute('delete_tag')) {
                this.deleteSingle(event.target.getAttribute('delete_tag'));
            }
        });
    }

    reload(): void {
        const table = $('#dataTable').DataTable();
        table.ajax.reload();
    }

    async initDataTable() {
        try {
            const that = this;
            this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 10,
                ajax: (dataTablesParameters: any, callback) => {
                    $('button').removeClass('dt-button');
                    that.http.get(environment.host + 'cross-reference/details', dataTablesParameters).subscribe((res: any) => {
                        if (res.success) {
                            callback({data: res.data});
                        } else {
                            callback({data: []});
                        }
                    }, (err: any) => {
                        that.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
                        callback({data: []});
                    });
                },
                columns: [
                    {
                        title: 'ID',
                        data: 'id'
                    },
                    {
                        title: 'Cross Reference',
                        data: 'crossReference.item_number'
                    },
                    {
                        title: 'Website ID',
                        data: 'website.name'
                    },
                    {
                        title: 'Brand ID',
                        data: 'brand.name'
                    },
                    {
                        title: 'Ratio',
                        data: 'ratio'
                    },
                    {
                        title: 'Calculated Amount',
                        data: 'calculated_amount',
                        render(data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-light-success">${data}</span>` : `<span class="badge badge-light-danger">Not Calculated</span>`;
                        }
                    },
                    {
                        title: 'Action',
                        render(data: any, type: any, full: any) {
                            return `
                        <a type="button" edit_tag="${full.id}">
                            <i edit_tag="${full.id}" class="icon feather icon-edit f-16 text-c-green"></i>
                        </a>
                        <a type="button" delete_tag="${full.id}">
                            <i delete_tag="${full.id}" class="icon feather icon-trash-2 f-16 ml-3 text-c-red"></i>
                        </a>`;
                        }
                    }
                ]
            };
        } catch (e) {
            this.toastr.addToast({title: 'Error', msg: e.message, type: 'error'});
        }
    }

    deleteSingle(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.http.delete(environment.host + 'cross-reference/details/' + id).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        this.toastr.addToast({title: 'Success', msg: res.message, type: 'success'});
                    } else {
                        this.toastr.addToast({title: 'Error', msg: res.error, type: 'error'});
                    }
                }, (err: any) => {
                    this.toastr.addToast({title: 'Error', msg: err.message, type: 'error'});
                });
            }
        });
    }
}
