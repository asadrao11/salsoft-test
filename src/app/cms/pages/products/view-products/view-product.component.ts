import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { Router } from '@angular/router';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/cms/services/common.service';

@Component({
    selector: 'app-view-user',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements AfterViewInit, OnInit {

    dtOptions: any;
    searchText = '';

    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private renderer: Renderer2,
        private router: Router,
        private commonService: CommonService,
    ) { }

    ngOnInit() {
        this.initDataTable();
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("assign_tag")) {
                const id = event.target.getAttribute("assign_tag");
                this.router.navigate(["/public/assign-attribute-product", id]);
            } else if (event.target.hasAttribute("deassign_tag")) {
                this.deassignAttributeGroup(event.target.getAttribute("deassign_tag"));
            } else if (event.target.hasAttribute("detail_tag")) {
                const id = event.target.getAttribute("detail_tag");
                this.router.navigate(["/public/detail-product", id]);
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            }
        });
    }

    reload(): void {
        const table = $('#dataTable').DataTable();
        table.ajax.reload();
    }


    searchClick() {
        this.reload();
    }

    async initDataTable() {
        try {
            const that = this;
            this.dtOptions = {
                pagingType: 'full_numbers',
                responsive: true,
                serverSide: true,
                processing: true,
                pageLength: 20,
                select: {
                    style: 'multi',
                    selector: 'td:first-child'
                },
                ajax: (dataTablesParameters: any, callback) => {
                    $('button').removeClass('dt-button');
                    const info = $('#dataTable').DataTable().page.info();

                    that.http.post(environment.host + 'product/getByPage', { page_params: info, search_text: that.searchText.trim() }).subscribe((res: any) => {
                        if (res.success) callback({
                            data: res.data.data,
                            recordsTotal: res.data.total,
                            recordsFiltered: res.data.total,
                        });
                        else callback({ data: [] });
                    }, (err: any) => {
                        that.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                        callback({ data: [] });
                    });
                },
                columns: [
                    {
                        orderable: false,
                        className: 'select-checkbox',
                        targets: 0,
                        render: function (data: any, type: any, full: any) { return ` `; }
                    },
                    {
                        title: 'ID',
                        data: 'id'
                    },
                    {
                        title: 'Name',
                        data: 'name'
                    },
                    {
                        title: 'SKU',
                        data: 'SKU',
                        render: function (data: any, type: any, full: any) {
                            return full.attribute_group_id ?
                                `<a type="button" detail_tag="${full.id}">${data}</a>` :
                                `<a type="button" assign_tag="${full.id}">${data}</a>`;
                        }
                    },
                    {
                        title: 'Attribute Group',
                        data: 'attribute_group_name',
                        render: function (data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-primary">${data}</span>` : `<span class="badge badge-danger" style="font-size: 8px;">Not Assigned</span>`;
                        }
                    },
                    {
                        title: 'Category',
                        data: 'category_name',
                        render: function (data: any, type: any, full: any) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: 'Brand',
                        data: 'brand_name',
                        render: function (data: any, type: any, full: any) {
                            return data ? data : '';
                        }
                    },
                    // {
                    //     title: 'Created At',
                    //     data: 'created_at'
                    // },
                    // {
                    //     title: 'Updated At',
                    //     data: 'updated_at'
                    // },
                    // {
                    //     title: 'Created By',
                    //     data: 'created_by',
                    //     render: function (data: any, type: any, full: any) {
                    //         let user = that.commonService.AllUsers.find(x => x.id === data);
                    //         return user ? user.name : 'Not Found';
                    //     }
                    // },
                    // {
                    //     title: 'Updated By',
                    //     data: 'updated_by',
                    //     render: function (data: any, type: any, full: any) {
                    //         let user = that.commonService.AllUsers.find( x => x.id === data);
                    //         return user ? user.name : 'Not Found';
                    //     }
                    // },
                    {
                        title: 'Status',
                        data: 'active',
                        render: function (data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-light-success">Active</span>` : `<span class="badge badge-light-danger">Inactive</span>`
                        }
                    },
                    {
                        title: 'Actions',
                        render: function (data: any, type: any, full: any) {
                            let HTML = full.attribute_group_id ?
                                `<button deassign_tag="${full.id}" class="btn btn-icon-2 btn-warning">
                                        <i class="feather icon-x" deassign_tag="${full.id}"></i>
                                    </button>&nbsp;&nbsp;` :
                                `<button assign_tag="${full.id}" class="btn btn-icon btn-primary">
                                            <i class="feather icon-link" assign_tag="${full.id}"></i>
                                    </button>&nbsp;&nbsp;`;
                            HTML += `<button delete_tag="${full.id}" class="btn btn-icon btn-danger">
                                        <i class="feather icon-trash-2" delete_tag="${full.id}"></i>
                                     </button>&nbsp;&nbsp;`
                            HTML += full.attribute_group_id ?
                                `<button detail_tag="${full.id}" class="btn btn-icon-2 btn-secondary">
                                        <i class="feather icon-maximize" detail_tag="${full.id}"></i>
                                    </button>` : ``;
                            return HTML;
                        }
                    }
                ],
                dom: `Btrip`,
                buttons: [
                    { extend: 'colvis', text: '<i class="feather icon-eye-off"></i>&nbsp;Columns', className: 'btn btn-primary', visible: 0 },
                    { extend: 'copy', text: '<i class="feather icon-copy"></i>&nbsp;Copy', className: 'btn btn-primary', visible: false },
                    // { extend: 'print', text: '<i class="feather icon-printer"></i>&nbsp;Print', className: 'btn btn-primary', visible: false },
                    // { extend: 'excel', text: '<i class="feather icon-file-text"></i>&nbsp;Export to Excel', className: 'btn btn-primary' },
                    // { extend: 'csv', text: '<i class="feather icon-file-text"></i>&nbsp;Export to CSV', className: 'btn btn-primary' },
                    { extend: 'selectAll', text: '<i class="feather icon-align-justify"></i>&nbsp;Select All', className: 'btn btn-primary' },
                    { extend: 'selectNone', text: '<i class="feather icon-x"></i>&nbsp;Select None', className: 'btn btn-primary' },
                    {
                        text: '<i class="feather icon-trash-2"></i>&nbsp;Bulk Delete',
                        className: 'btn btn-primary',
                        action: async function () {
                            const table = $('#dataTable').DataTable();
                            const rows = table.rows({ selected: true });
                            await that.bulkDelete(rows.data().toArray());
                        }
                    }
                ]
            };
        } catch (e) { this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' }); }
    }


    async bulkDelete(data) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' products. All links will be deleted.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting products', type: 'wait' });
                this.http.post(environment.host + 'product/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Products has been deleted.',
                            'success'
                        )
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        });
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
                this.http.delete(environment.host + 'product/' + id).subscribe((res: any) => {
                    if (res.success === true) {
                        this.reload();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: 'Product cannot be deleted', type: 'error' });
                        console.log(res.message);
                    }
                },
                    (err: any) => {
                        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                    });
            }
        });
    }

    async deassignAttributeGroup(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to deassign complete attribute group?',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.http.post(environment.host + 'assignment/deassignGroup', { product_id: id }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        });
    }

}