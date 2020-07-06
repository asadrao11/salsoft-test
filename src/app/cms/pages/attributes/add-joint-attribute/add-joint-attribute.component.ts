import { Component, OnInit, Renderer2 } from '@angular/core';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { environment } from 'src/environments/environment';
import { UploaderService } from 'src/app/cms/services/uploader.service';
import { DualListComponent } from 'angular-dual-listbox';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/cms/services/common.service';
import { flatMap } from 'rxjs/operators';

@Component({
    selector: 'add-joint-attribute',
    templateUrl: './add-joint-attribute.component.html',
    styleUrls: ['./add-joint-attribute.component.scss']
})

export class AddJointAttributeComponent implements OnInit {

    addForm: FormGroup;
    format: any = DualListComponent.DEFAULT_FORMAT;
    attributeList = [];
    attributeGroupDropDown = [];
    attributeSelected = [];

    isUpdate = false;
    updateID = null;
    submitLoader = false;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private toastr: ToasterService,
        private router: Router,
        private renderer: Renderer2,
    ) { }

    ngOnInit() {
        this.initDataTable();
        this.addForm = this.formBuilder.group({
            name: [null, Validators.required],
            attributeGroups: [null, Validators.required]
        });
        this.getAttributeList();
        this.getAttributeGroupDropDown();
    }

    async getAttributeList() {
        try {
            this.attributeList = [];
            this.http.get(environment.host + 'attribute')
                .subscribe((res: any) => {
                    if (res.success) this.attributeList = res.data;
                    else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async getAttributeGroupDropDown() {
        try {
            this.http.get(environment.host + 'attributeGroup').subscribe((res: any) => {
                if (res.success) this.attributeGroupDropDown = res.data;
                else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
            }, (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    async onSubmit() {
        try {
            this.submitLoader = true;
            if(this.isUpdate) {
                const body = {
                    id: this.updateID,
                    name: this.addForm.controls.name.value,
                    attributeGroups: this.addForm.controls.attributeGroups.value,
                    attributes: this.attributeSelected
                }
                this.http.post(`${environment.host}joint-attribute/update`, body).subscribe((res: any) => {
                    if (res.success) {
                        this.toastr.addToast({ title: 'Success', msg: 'Joint Attribute Updated Successfully', type: 'success' });
                        this.addForm.reset();
                        this.attributeSelected = null;
                        this.isUpdate = false;
                        this.reload();
                        this.submitLoader = false;
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
                        this.submitLoader = false;
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
            else {
                const body = {
                    name: this.addForm.controls.name.value,
                    attributeGroups: this.addForm.controls.attributeGroups.value,
                    attributes: this.attributeSelected
                }
                this.http.post(`${environment.host}joint-attribute`, body).subscribe((res: any) => {
                    if (res.success) {
                        this.toastr.addToast({ title: 'Success', msg: 'Joint Attribute Added Successfully', type: 'success' });
                        this.addForm.reset();
                        this.attributeSelected = null;
                        this.isUpdate = false;
                        this.reload();
                        this.submitLoader = false;
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: res.error, type: 'error' });
                        this.submitLoader = false;
                    }
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async loadJointAtbForUpdate(id) {
        try {
            this.toastr.addToast({ title: 'Please wait', msg: "Loading joint attribute for update", type: 'wait' });
            this.http.get(environment.host + 'joint-attribute/' + id).subscribe((res: any) => {
                if (res.success) {
                    window.scroll(0, 0);
                    this.isUpdate = true;
                    this.updateID = id;
                    this.addForm.controls.name.setValue(res.data.name);
                    this.addForm.controls.attributeGroups.setValue(res.data.attribute_groups);
                    this.attributeSelected = res.data.attributes;
                }
                else {
                    this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (err: any) => {
                this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            });
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }













    dtOptions: any;

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("edit_tag")) {
                const id = event.target.getAttribute("edit_tag");
                this.loadJointAtbForUpdate(id);
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
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
                    that.http.get(environment.host + 'joint-attribute', dataTablesParameters).subscribe((res: any) => {
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
                        className: 'select-checkbox text-center',
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
                        title: 'Attributes',
                        data: 'attributes',
                        render: function (data: any, type: any, full: any) {
                            let HTML = ``;
                            for (let atb of data) {
                                HTML += `<label class="badge badge-pill badge-primary">${atb?.id} : ${atb?.title}</label><br>`
                            }
                            return HTML;
                        }
                    },
                    {
                        title: 'Attribute Groups',
                        data: 'attribute_groups',
                        render: function (data: any, type: any, full: any) {
                            let HTML = ``;
                            for (let atb of data) {
                                HTML += `<label class="badge badge-pill badge-danger">${atb?.id} : ${atb?.name}</label><br>`
                            }
                            return HTML;
                        }
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
                        title: 'Actions',
                        render: function (data: any, type: any, full: any) {
                            return `
                            <button data-toggle="tooltip" edit_tag="${full.id}" class="btn btn-icon-2 btn-warning" title="Edit">
                                <i edit_tag="${full.id}" class="icon feather icon-edit"></i>
                            </button>&nbsp;
                            <button data-toggle="tooltip" delete_tag="${full.id}" class="btn btn-icon-2 btn-danger" title="Delete">
                                <i delete_tag="${full.id}" class="icon feather icon-trash-2"></i>
                            </button>`
                        }
                    }
                ],
                dom: `Bftrip`,
                buttons: [
                    { extend: 'colvis', text: '<i class="feather icon-eye-off"></i>&nbsp;Columns', className: 'btn btn-primary', visible: 0 },
                    { extend: 'copy', text: '<i class="feather icon-copy"></i>&nbsp;Copy', className: 'btn btn-primary', visible: false },
                    { extend: 'print', text: '<i class="feather icon-printer"></i>&nbsp;Print', className: 'btn btn-primary', visible: false },
                    { extend: 'excel', text: '<i class="feather icon-file-text"></i>&nbsp;Export to Excel', className: 'btn btn-primary' },
                    { extend: 'csv', text: '<i class="feather icon-file-text"></i>&nbsp;Export to CSV', className: 'btn btn-primary' },
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
                ],
            };
        } catch (e) { this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' }); }
    }


    async bulkDelete(data) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' attributes. All links will be deleted.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting attributes', type: 'wait' });
                this.http.post(environment.host + 'joint-attribute/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Attributes has been deleted.',
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
                this.http.delete(environment.host + 'joint-attribute/' + id).subscribe((res: any) => {
                    if (res.success === true) {
                        this.reload();
                        this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
                    } else {
                        this.toastr.addToast({ title: 'Error', msg: 'Joint attribute cannot be deleted', type: 'error' });
                        console.log(res.message);
                    }

                },
                    (err: any) => {
                        this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                    });
            }
        });
    }


}