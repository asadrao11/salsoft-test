import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {ToasterService} from '../../../services/toaster.service';

@Component({
    selector: 'app-view-web-cross-reference',
    templateUrl: './view-web-cross-reference.component.html',
    styleUrls: ['./view-web-cross-reference.component.scss']
})
export class ViewWebCrossReferenceComponent implements OnInit, AfterViewInit {

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
                this.router.navigate(['/public/edit-web-cross-reference', id]);
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
                    that.http.get(environment.host + 'cross-reference/web', dataTablesParameters).subscribe((res: any) => {
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
                        title: 'Website',
                        data: 'website.name'
                    },
                    {
                        title: 'Cross Reference',
                        data: 'crossReference',
                        render(data: any, type: any, full: any) { return data ? data.item_number : ' ' }
                        
                    },
                    {
                        title: 'Price',
                        data: 'price'
                    },
                    {
                        title: 'Created At',
                        data: 'created_at'
                    },
                    {
                        title: 'Updated At',
                        data: 'updated_at'
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
                this.http.delete(environment.host + 'cross-reference/web/' + id).subscribe((res: any) => {
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
