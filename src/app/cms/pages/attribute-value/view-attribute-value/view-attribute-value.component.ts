import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import Swal from 'sweetalert2';

@Component({
    selector: 'app-view-attribute-value',
    templateUrl: './view-attribute-value.component.html',
    styleUrls: ['./view-attribute-value.component.scss']
})
export class ViewAttributeValueComponent implements OnInit, AfterViewInit {

    dtOptions: any;
    searchText = '';

    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private renderer: Renderer2,
        private router: Router
    ) { }

    ngOnInit() {
        this.initDataTable();
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("edit_tag")) {
                const id = event.target.getAttribute("edit_tag");
                this.router.navigate(["/public/edit-attribute-value", id, "value"]);
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            } else if (event.target.hasAttribute("edit_value_group")) {
                const id = event.target.getAttribute("edit_value_group");
                this.router.navigate(["/public/edit-attribute-value", id, "group"]);
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

                    that.http.post(environment.host + 'attributeValue/getByPage', { page_params: info, search_text: that.searchText.trim() }).subscribe((res: any) => {
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
                    $('#dataTable').dataTable();
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
                        title: 'Value',
                        data: 'value'
                    },
                    {
                        title: 'Attributes',
                        data: 'links',
                        render: function (data: any, type: any, full: any) {
                            let HTML = ``;
                            for (let atb of data) {
                                HTML += `<label class="badge badge-pill badge-primary">${atb?.attribute}</label><br>`
                            }
                            return HTML;
                        }
                    },
                    {
                        title: 'Categories',
                        data: 'links',
                        render: function (data: any, type: any, full: any) {
                            let HTML = ``;
                            for (let cat of data) {
                                HTML += `<label class="badge badge-pill badge-light-danger">${cat?.category}</label><br>`
                            }
                            return HTML;
                        }
                    },
                    {
                        title: 'Actions',
                        render: function (data: any, type: any, full: any) {
                            return `
                            <button edit_value_group="${full.id}" class="btn btn-icon-2 btn-primary" title="Edit Assigned Group">
                                <i edit_value_group="${full.id}" class="icon feather icon-edit"></i>
                            </button>&nbsp;&nbsp;

                            <button  edit_tag="${full.id}" class="btn btn-icon-2 btn-warning" title="Edit Value Only">
                                <i edit_tag="${full.id}" class="icon feather icon-edit-2"></i>
                            </button>&nbsp;&nbsp;
                            
                            <button data-toggle="tooltip" delete_tag="${full.id}" class="btn btn-icon-2 btn-danger" title="Delete">
                                <i delete_tag="${full.id}" class="icon feather icon-trash-2"></i>
                            </button>`
                        }
                    }
                ],
                dom: `Btrip`,
                // dom: `<'row'<'col-md-12'B>>  <'row'<'col-md-12'>>  <'row' <'col-md-6'l> <'col-md-6'> >" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>`,
                buttons: [
                    { extend: 'colvis', text: '<i class="feather icon-eye-off"></i>&nbsp;Columns', className: 'btn btn-secondary', visible: 0 },
                    { extend: 'copy', text: '<i class="feather icon-copy"></i>&nbsp;Copy', className: 'btn btn-primary', visible: false },
                    // { extend: 'print', text: '<i class="feather icon-printer"></i>&nbsp;Print', className: 'btn btn-primary', visible: false },
                    // { extend: 'excel', text: '<i class="feather icon-file-text"></i>&nbsp;Export to Excel', className: 'btn btn-primary' },
                    // { extend: 'csv', text: '<i class="feather icon-file-text"></i>&nbsp;Export to CSV', className: 'btn btn-primary' },
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
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' attribute value(s). They will be automatically deassigned from attributes.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting attribute values', type: 'wait' });
                this.http.post(environment.host + 'attributeValue/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Attribute values has been deleted.',
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
                this.http.delete(environment.host + 'attributeValue/' + id).subscribe((res: any) => {
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