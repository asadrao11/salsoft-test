import { Component, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/cms/services/common.service';
import { UploaderService } from 'src/app/cms/services/uploader.service';

@Component({
    selector: 'app-product-images',
    templateUrl: './product-images.component.html',
    styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit, AfterViewInit {

    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private renderer: Renderer2,
        private router: Router,
        private commonService: CommonService,
        private uploaderService: UploaderService
    ) { }


    // ZIP UPLOAD SECTION

    submitLoader = false;
    selectedFile = null;
    selectedFileName = "Please select zip file";

    handleZipFileInput(e) {
        if (e.target.files && e.target.files[0]) {
            this.selectedFile = e.target.files[0];
            this.selectedFileName = e.target.files[0].name;
        } else {
            this.selectedFile = null;
            this.selectedFileName = "Please select zip file";
            this.toastr.addToast({ title: 'Error', msg: "Please select zip file", type: 'error' });
        }
    }

    imageUploadClick() {
        try {
            if (this.selectedFile) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Images are uploading', type: 'wait' });
                this.submitLoader = true;
                const file = new FormData();
                file.append('file', this.selectedFile, this.selectedFileName);
                this.http.post(environment.host + 'product-images/bulkUpload', file).subscribe((res: any) => {
                    this.submitLoader = false;
                    Swal.fire(
                        'Uploaded!',
                        'Images has been uploaded.',
                        'success'
                    );
                    this.reload();
                }, (err: any) => {
                    this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
                });
            } else {
                this.toastr.addToast({ title: 'Error', msg: "Please select file first", type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    // VIEW IMAGES SECTION

    dtOptions: any;

    ngOnInit() {
        this.initDataTable();
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("edit_tag")) {
                const id = event.target.getAttribute("edit_tag");
                this.router.navigate(["/public/edit-brand", id]);
            } else if (event.target.hasAttribute("delete_tag")) {
                this.deleteSingle(event.target.getAttribute("delete_tag"))
            }
        });
    }

    reload(): void {
        this.selectedFile = null;
        this.selectedFileName = "Please select zip file";
        const table = $('#dataTable').DataTable();
        table.ajax.reload();
    }

    async initDataTable() {
        try {
            const that = this;
            this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 10,
                responsive: true,
                select: {
                    style: 'multi',
                    selector: 'td:first-child'
                },
                ajax: (dataTablesParameters: any, callback) => {
                    $('button').removeClass('dt-button');
                    that.http.get(environment.host + 'product-images/listImages', dataTablesParameters).subscribe(async (res: any) => {
                        if (res.success) {
                            callback({ data: res.data });
                        }
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
                    // {
                    //     title: 'Image',
                    //     data: 'imageUrl',
                    //     render: function (data: any, type: any, full: any) {
                    //         if (data) {
                    //             return `<img src="${data}" alt="brand icon" class="img-radius align-top m-r-15" style="width:40px;">`;
                    //         } else {
                    //             return `<img src="assets/images/brands/default-brand-icon.png" alt="brand icon" class="img-radius align-top m-r-15" style="width:40px;">`;
                    //         }
                    //     }
                    // },
                    {
                        title: 'Image Name',
                        data: 'name'
                    },
                    {
                        title: 'Action',
                        render: function (data: any, type: any, full: any) {
                            // <a type="button" edit_tag="${full.id}" ngbTooltip="Edit Brand">
                            //     <i edit_tag="${full.id}" class="icon feather icon-edit f-16 text-c-green"></i>
                            // </a> 
                            return `
                            <button data-toggle="tooltip" delete_tag="${full.name}" class="btn btn-icon-2 btn-danger" title="Delete">
                                <i delete_tag="${full.name}" class="icon feather icon-trash-2"></i>
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
            text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' images.',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((willDelete) => {
            if (!willDelete.dismiss) {
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting...', type: 'wait' });
                this.http.post(environment.host + 'product-images/bulkDelete', { data }).subscribe((res: any) => {
                    if (res.success) {
                        this.reload();
                        Swal.fire(
                            'Deleted!',
                            'Images has been deleted.',
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
                this.toastr.addToast({ title: 'Please wait', msg: 'Deleting...', type: 'wait' });
                this.http.delete(environment.host + 'product-images/deleteImage/' + id).subscribe((res: any) => {
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



    // BULK ASSIGNING SECTION


    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;

    handleFileInput(e) {
        if (e.target.files.length === 1) {
            this.eventData = e;
            this.filename = e.target.files.item(0).name;
            this.fileAdded = true;
            this.uploadDataReady = false;
        } else {
            this.filename = 'Choose File';
            this.fileAdded = false;
            this.uploadDataReady = false;
            this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
        }
    }


    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(
                    this.eventData.target.files[0], 'assign-image-to-product'
                );
                if (this.dataForUploading.length > 0) {
                    this.uploadDataReady = true;
                }
            } else {
                this.filename = 'Choose File';
                this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
                this.uploadDataReady = false;
            }
        } catch (e) {
            this.uploadDataReady = false;
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    startUploading() {
        this.uploaderService.start_Upload();
    }
}