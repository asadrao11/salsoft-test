import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-view-orders',
    templateUrl: './view-orders.component.html',
    styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements AfterViewInit, OnInit {
    @ViewChild('viewItemsModalClose') viewItemsModalClose: ElementRef<HTMLElement>;
    @ViewChild('viewItemsModalOpen') viewItemsModalOpen: ElementRef<HTMLElement>;
    @ViewChild('editOrderModalOpen') editOrderModalOpen: ElementRef<HTMLElement>;

    dtOptions: any;
    itemList = [];

    editOrderForm: FormGroup;

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
        this.editOrderForm = this.formBuilder.group({
            id: [null],
            customer_id: [null],
            payment_type: [null],
            state: [null],
            status: [null],
            is_guest: [null],
            ip_address: [null],
            sale_origin: [null],
            qty_ordered: [null],
            discount_amount: [null],
            shipping_amount: [null],
            sub_total: [null],
            grand_total: [null],
            total_paid: [null],
            is_on_hold: [null],
            created_at: [null],
            updated_at: [null],
        });
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("edit_order_tag")) {
                this.editOrderModal(event.target.getAttribute("edit_order_tag"))
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            } else if (event.target.hasAttribute("view_order_item")) {
                this.openViewOrderItemsModal(event.target.getAttribute("view_order_item"))
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
                    that.http.get(environment.host + 'order', dataTablesParameters).subscribe((res: any) => {
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
                        title: 'Order ID',
                        data: 'id'
                    },
                    {
                        title: 'Customer ID',
                        data: 'customer_id'
                    },
                    {
                        title: 'Customer Name',
                        data: 'customer',
                        render: function (data: any, type: any, full: any) {
                            return data ? `${data.first_name} ${data.last_name}` : ``
                        }
                    },
                    {
                        title: 'Payment Type',
                        data: 'payment_type'
                    },
                    {
                        title: 'State',
                        data: 'state'
                    },
                    {
                        title: 'Status',
                        data: 'status',
                        render: function (data: any, type: any, full: any) {
                            if(data === "unverified")
                                return `<span class="badge badge-danger">Unverified</span>`;
                            else if(data === "verified")
                                return `<span class="badge badge-success">Verified</span>`;
                            else if(data === "item procured")
                                return `<span class="badge badge-warning">Item Procured</span>`;
                            else if(data === "ready to processs")
                                return `<span class="badge badge-secondary">Ready to Processs</span>`;
                            else if(data === "invoicing")
                                return `<span class="badge badge-dark">Invoicing</span>`;
                            else if(data === "ready to ship")
                                return `<span class="badge badge-secondary">Ready to Ship</span>`;
                            else if(data === "shipped")
                                return `<span class="badge badge-primary">Shipped</span>`;
                            else
                                return `<span class="badge badge-light-danger">NOT FOUND</span>`;
                        }
                    },
                    {
                        title: 'Is Guest',
                        data: 'is_guest',
                        render: function (data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-light-success">Yes</span>` : `<span class="badge badge-light-danger">No</span>`
                        }
                    },
                    {
                        title: 'IP Address',
                        data: 'ip_address'
                    },
                    {
                        title: 'Sale Origin',
                        data: 'sale_origin'
                    },
                    {
                        title: 'Qty',
                        data: 'qty_ordered'
                    },
                    {
                        title: 'Discount',
                        data: 'discount_amount'
                    },
                    {
                        title: 'Shipping',
                        data: 'shipping_amount'
                    },
                    {
                        title: 'Sub Total',
                        data: 'sub_total'
                    },
                    {
                        title: 'Grand Total',
                        data: 'grand_total'
                    },
                    {
                        title: 'Total Paid',
                        data: 'total_paid'
                    },
                    {
                        title: 'Is on Hold',
                        data: 'is_on_hold',
                        render: function (data: any, type: any, full: any) {
                            return data ? `<span class="badge badge-light-success">Yes</span>` : `<span class="badge badge-light-danger">No</span>`
                        }
                    },
                    {
                        title: 'Actions',
                        render: function (data: any, type: any, full: any) {
                            return `
                            <button  view_order_item="${full.id}" class="btn btn-icon-2 btn-primary">
                                <i view_order_item="${full.id}" class="icon feather icon-briefcase"></i>
                            </button>&nbsp;&nbsp;
                            <button  edit_order_tag="${full.id}" class="btn btn-icon-2 btn-warning">
                                <i edit_order_tag="${full.id}" class="icon feather icon-edit"></i>
                            </button>`
                            // &nbsp;&nbsp;
                            // <button data-toggle="tooltip" delete_tag="${full.id}" class="btn btn-icon-2 btn-danger">
                            //     <i delete_tag="${full.id}" class="icon feather icon-trash-2"></i>
                            // </button>
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
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' orders. They will be automatically deassigned from attributes.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting orders', type: 'wait' });
                this.http.post(environment.host + 'order/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Orders has been deleted.',
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
                this.http.delete(environment.host + 'order/' + id).subscribe((res: any) => {
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


    async openViewOrderItemsModal(orderId) {
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




    async editOrderModal(orderId) {
        (this.editOrderModalOpen.nativeElement).click();
        this.http.get(environment.host + 'order/' + orderId).subscribe((res: any) => {
            if (res.success) {
                this.editOrderForm.setValue(res.data);
            } else {
                this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
            }
        }, (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
        });
    }


    async changeOrderStatus(e) {
        console.log(e);
        const body = {
            id: this.editOrderForm.controls.id.value,
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
}