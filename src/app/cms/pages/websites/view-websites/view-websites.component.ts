import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { environment } from 'src/environments/environment';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/cms/services/common.service';

@Component({
    selector: 'app-view-websites',
    templateUrl: './view-websites.component.html',
    styleUrls: ['./view-websites.component.scss']
})
export class ViewWebsitesComponent implements OnInit, AfterViewInit {

    dtOptions: any;

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
            if (event.target.hasAttribute("edit_tag")) {
                const id = event.target.getAttribute("edit_tag");
                this.router.navigate(["/public/edit-website", id]);
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            } else if (event.target.hasAttribute("assign_tag")) {
                const id = event.target.getAttribute("assign_tag");
                this.router.navigate(["/public/assign-product-to-website", id]);
            } else if (event.target.hasAttribute("setting_tag")) {
                const id = event.target.getAttribute("setting_tag");
                this.router.navigate(["/public/website-setting", id]);
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
                pageLength: 20,
                responsive: true,
                select: {
                    style: 'multi',
                    selector: 'td:first-child'
                },
                ajax: (dataTablesParameters: any, callback) => {
                    $('button').removeClass('dt-button');
                    that.http.get(environment.host + 'website', dataTablesParameters).subscribe((res: any) => {
                        if (res.success) callback({ data: res.data });
                        else {
                            callback({ data: [] });
                            that.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                        }
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
                        title: 'Created By',
                        data: 'created_by',
                        render: function (data: any, type: any, full: any) {
                            let user = that.commonService.AllUsers.find( x => x.id === data);
                            return user ? user.name : 'Not Found';
                        }
                    },
                    {
                        title: 'Updated By',
                        data: 'updated_by',
                        render: function (data: any, type: any, full: any) {
                            let user = that.commonService.AllUsers.find( x => x.id === data);
                            return user ? user.name : 'Not Found';
                        }
                    },
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
                            return `
                          <button assign_tag="${full.id}" class="btn btn-icon btn-primary" title="Assign Products">
                             <i assign_tag="${full.id}" class="icon feather icon-link"></i>
                          </button>
                          <button setting_tag="${full.id}" class="btn btn-icon-2 btn-secondary" title="Website Settings">
                              <i setting_tag="${full.id}" class="icon feather icon-settings"></i>
                          </button>
                          <button edit_tag="${full.id}" class="btn btn-icon-2 btn-warning" title="Edit Website">
                              <i edit_tag="${full.id}" class="icon feather icon-edit"></i>
                          </button>
                          <button delete_tag="${full.id}" class="btn btn-icon btn-danger" title="Delete Website">
                              <i delete_tag="${full.id}" class="icon feather icon-trash-2"></i>
                          </button>`
                        }
                    }
                ],
                dom: `Bftrip`,
                buttons: [
                    { extend: 'colvis', text: '<i class="feather icon-eye-off"></i>&nbsp;Columns', className: 'btn btn-secondary', visible: 0 },
                    { extend: 'copy', text: '<i class="feather icon-copy"></i>&nbsp;Copy', className: 'btn btn-primary', visible: false },
                    { extend: 'print', text: '<i class="feather icon-printer"></i>&nbsp;Print', className: 'btn btn-primary', visible: false },
                    { extend: 'excel', text: '<i class="feather icon-file-text"></i>&nbsp;Export to Excel', className: 'btn btn-primary' },
                    { extend: 'csv', text: '<i class="feather icon-file-text"></i>&nbsp;Export to CSV', className: 'btn btn-primary' },
                    { extend: 'selectAll', text: '<i class="feather icon-align-justify"></i>&nbsp;Select All', className: 'btn btn-primary' },
                    { extend: 'selectNone', text: '<i class="feather icon-x"></i>&nbsp;Select None', className: 'btn btn-primary' },
                    {
                        text: '<i class="feather icon-trash-2"></i>&nbsp;Bulk Delete',
                        className: 'btn btn-danger',
                        action: async function () {
                            const table = $('#dataTable').DataTable();
                            const rows = table.rows({ selected: true });
                            await that.bulkDelete(rows.data().toArray());
                        }
                    }
                ],
            };
        } catch (e) { this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' }); }
    }


    async bulkDelete(data) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' attribute groups. They will be automatically deassigned from attributes.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting selected webistes', type: 'wait' });
                this.http.post(environment.host + 'website/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Websites has been deleted.',
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
                this.http.delete(environment.host + 'website/' + id).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        });
    }
}