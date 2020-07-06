import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderService } from '../../../services/uploader.service';

@Component({
    selector: 'app-bulk-assign-attribute',
    templateUrl: './bulk-assign-attribute.component.html',
    styleUrls: ['./bulk-assign-attribute.component.scss']
})
export class BulkAssignAttributeComponent {
    
    constructor(
        private http: HttpClient,
        private toastr: ToasterService,
        private uploaderService: UploaderService
    ) { }



    // Upload section
    public filename = 'Choose File';
    public fileAdded = false;
    public uploadDataReady = false;
    public dataForUploading: any = [];
    public eventData: any;

    // Upload Section 2
    public filename2 = 'Choose File';
    public fileAdded2 = false;
    public uploadDataReady2 = false;
    public dataForUploading2: any = [];
    public eventData2: any;

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

    handleFileInput2(e) {
        if (e.target.files.length === 1) {
            this.eventData2 = e;
            this.filename2 = e.target.files.item(0).name;
            this.fileAdded2 = true;
            this.uploadDataReady2 = false;
        } else {
            this.filename2 = 'Choose File';
            this.fileAdded2 = false;
            this.uploadDataReady2 = false;
            this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
        }
    }

    async fileUpload() {
        try {
            if (this.fileAdded) {
                this.dataForUploading = await this.uploaderService.read_Excel_File(
                    this.eventData.target.files[0], 'assign-attribute-group-to-product'
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

    async fileUpload2() {
        try {
            if (this.fileAdded2) {
                this.dataForUploading2 = await this.uploaderService.read_Excel_File(
                    this.eventData2.target.files[0], 'assign-attribute-to-product'
                );
                if (this.dataForUploading2.length > 0) {
                    this.uploadDataReady2 = true;
                }
            } else {
                this.filename2 = 'Choose File';
                this.toastr.addToast({ title: 'Error', msg: 'Please select a file', type: 'error' });
                this.uploadDataReady2 = false;
            }
        } catch (e) {
            this.uploadDataReady2 = false;
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    startUploading() {
        this.uploaderService.start_Upload();
    }


    
}