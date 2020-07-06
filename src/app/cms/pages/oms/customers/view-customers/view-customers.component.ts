import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-view-customers',
    templateUrl: './view-customers.component.html',
    styleUrls: ['./view-customers.component.scss']
})
export class ViewCustomersComponent implements AfterViewInit, OnInit {
    @ViewChild('viewItemsModalClose') viewItemsModalClose: ElementRef<HTMLElement>;
    @ViewChild('viewItemsModalOpen') viewItemsModalOpen: ElementRef<HTMLElement>;
    @ViewChild('editCustomerModalOpen') editCustomerModalOpen: ElementRef<HTMLElement>;
    @ViewChild('editCustomerModalClose') editCustomerModalClose: ElementRef<HTMLElement>;

    dtOptions: any;
    itemList = [];

    editCustomerForm: FormGroup;

    orderStatuses = [
        { name: 'unverified' },
        { name: 'verified' },
        { name: 'item procured' },
        { name: 'ready to processs' },
        { name: 'invoicing' },
        { name: 'ready to ship' },
        { name: 'shipped' },
    ]

    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private renderer: Renderer2,
        private router: Router,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        this.initDataTable();
        this.editCustomerForm = this.formBuilder.group({
            id: [null, [Validators.required]],
            web_id: [null, [Validators.required]],
            first_name: [null, [Validators.required]],
            last_name: [null, [Validators.required]],
            email: [null, [Validators.required]],
            phone: [null, [Validators.required]],
            password: null,
            active: [null],
            deleted: [null],
            created_at: null,
            updated_at: null,
        });
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("edit_tag")) {
                this.editCustomerModal(event.target.getAttribute("edit_tag"))
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            } else if (event.target.hasAttribute("view_orders")) {
                this.openViewOrdersModal(event.target.getAttribute("view_orders"))
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
                pageLength: 25,
                responsive: true,
                select: {
                    style: 'multi',
                    selector: 'td:first-child'
                },
                ajax: (dataTablesParameters: any, callback) => {
                    $('button').removeClass('dt-button');
                    that.http.get(environment.host + 'customer', dataTablesParameters).subscribe((res: any) => {
                        if (res.success) callback({ data: res.data });
                        else callback({ data: [] });
                    }, (err: any) => {
                        that.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                        callback({ data: [] });
                    });
                },
                columns: [
                    {
                        orderable: false,
                        className: "select-checkbox",
                        data: null,
                        defaultContent: "",
                    },
                    {
                        title: 'ID',
                        data: 'id'
                    },
                    {
                        title: 'Web ID',
                        data: 'web_id'
                    },
                    {
                        title: 'Website',
                        data: 'website',
                        render: function (data: any, type: any, full: any) {
                            return data ? data.name : `<span class="badge badge-light-danger">Not Found</span>`
                        }
                    },
                    {
                        title: 'First Name',
                        data: 'first_name'
                    },
                    {
                        title: 'Last Name',
                        data: 'last_name'
                    },
                    {
                        title: 'Email',
                        data: 'email'
                    },
                    {
                        title: 'Phone',
                        data: 'phone'
                    },
                    {
                        title: 'Active',
                        data: 'active',
                        render: function (data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-light-success">Yes</span>` : `<span class="badge badge-light-danger">No</span>`
                        }
                    },
                    {
                        title: 'Created at',
                        data: 'created_at'
                    },
                    {
                        title: 'Updated at',
                        data: 'updated_at'
                    },
                    {
                        title: 'Actions',
                        render: function (data: any, type: any, full: any) {
                            return `
                            <button  view_orders="${full.id}" class="btn btn-icon-2 btn-primary" title="View Orders">
                                <i view_orders="${full.id}" class="icon feather icon-briefcase"></i>
                            </button>&nbsp;&nbsp;
                            <button  edit_tag="${full.id}" class="btn btn-icon-2 btn-warning" title="Edit Customer">
                                <i edit_tag="${full.id}" class="icon feather icon-edit"></i>
                            </button>&nbsp;&nbsp;
                            <button data-toggle="tooltip" delete_tag="${full.id}" class="btn btn-icon-2 btn-danger" title="Delete Customer">
                                <i delete_tag="${full.id}" class="icon feather icon-trash-2"></i>
                            </button>`
                        }
                    }
                ],
                dom: `Bftrip`,
                // dom: `<'row'<'col-md-12'B>>  <'row'<'col-md-12'>>  <'row' <'col-md-6'l> <'col-md-6'f> >" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' Customers. They will be automatically deassigned from attributes.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting orders', type: 'wait' });
                this.http.post(environment.host + 'customer/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Customer has been deleted.',
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
                this.http.delete(environment.host + 'customer/' + id).subscribe((res: any) => {
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


    async openViewOrdersModal(orderId) {
        this.itemList = [];
        (this.viewItemsModalOpen.nativeElement).click();
        this.http.get(environment.host + 'order/items/' + orderId).subscribe((res: any) => {
            if (res.success) {
                this.itemList = res.data;
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    async editCustomerModal(orderId) {
        (this.editCustomerModalOpen.nativeElement).click();
        this.http.get(environment.host + 'customer/' + orderId).subscribe((res: any) => {
            if (res.success) {
                this.editCustomerForm.setValue(res.data);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    async changeOrderStatus(e) {
        const body = {
            id: this.editCustomerForm.controls.id.value,
            status: e.name
        };
        this.http.post(environment.host + 'order/updateStatus', body).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                this.reload();
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    async onCustomerUpdate() {
        this.http.post(environment.host + 'customer', this.editCustomerForm.value).subscribe((res: any) => {
            if (res.success) {
                this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                this.editCustomerForm.reset();
                (this.editCustomerModalClose.nativeElement).click();
                this.reload();
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    async onEditCustomerClose() {
        this.editCustomerForm.reset();
        (this.editCustomerModalClose.nativeElement).click();
    }
}