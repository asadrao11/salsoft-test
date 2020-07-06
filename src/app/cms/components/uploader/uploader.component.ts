import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';

import {environment} from 'src/environments/environment';
import {ToasterService} from 'src/app/cms/services/toaster.service';
import {QueueService} from '../../services/queue.service';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
    @ViewChild('forModalClose') forCloseModal: ElementRef<HTMLElement>;
    @Input() type: any;
    @Input() data: any;

    public successLogs = [];
    public errorLogs = [];
    public progressBarValue = '0';
    public uploadCompleted = false;

    constructor(
        public activeModal: NgbActiveModal,
        private http: HttpClient,
        private toastr: ToasterService,
        private queue: QueueService,
    ) {
        this.checkForData();
    }


    async checkForData() {
        await this.delay(500);
        this.uploadCompleted = false;
        switch (this.type) {
            case 'users':
                await this.upload_Common_Data('user');
                break;
            case 'brands':
                await this.upload_Common_Data('brand');
                break;
            case 'attribute-groups':
                await this.upload_Common_Data('attributeGroup');
                break;
            case 'websites':
                await this.upload_Common_Data('website');
                break;
            case 'categories':
                await this.upload_Common_Data('category');
                break;
            case 'attributes':
                await this.upload_Common_Data('attribute');
                break;
            case 'attribute-values':
                await this.upload_Common_Data('attributeValue');
                break;
            case 'units':
                await this.upload_Common_Data('unit');
                break;
            case 'products':
                await this.upload_Common_Data('product');
                break;
            case 'assign-attribute-group-to-product':
                await this.upload_Common_Data('assign/attributeGroupToProduct');
                break;
            case 'assign-attribute-to-product':
                await this.upload_Common_Data('assign/attributeToProduct');
                break;
            case 'assign-product-to-website':
                await this.upload_Common_Data('webProduct/assign');
                break;
            case 'assign-image-to-product':
                await this.upload_Common_Data('assign/assignImage');
                break;
            case 'assign-values-to-attributes':
                await this.upload_Common_Data('assign/valuesToAttribute');
                break;
        }
    }


    async upload_Common_Data(url) {
        try {
            const total = this.data.length;
            let msgName = '';
            let i = 1;
            for (const item of this.data) {
                try {
                    this.queue.invokePost(environment.host + 'bulk/' + url, item).subscribe(async (res: any) => {
                        switch (this.type) {
                            case 'attributes':
                                msgName = item.title;
                                break;
                            case 'attribute-values':
                                msgName = item.value;
                                break;
                            case 'units':
                                msgName = item.title;
                                break;
                            case 'assign-attribute-group-to-product':
                                // msgName = item.product_name + " with " + item.attribute_group_name;
                                msgName = item.product_id + " with " + item.attribute_group_id;
                                break;
                            case 'assign-attribute-to-product':
                                // msgName = item.product_name + " with " + item.attribute_name + " as unit "+ item.unit_name;
                                msgName = item.product_id + " with " + item.attribute_id;
                                break;
                            case 'assign-image-to-product':
                                msgName = item.product_sku + " with " + item.image;
                                break;
                            case 'assign-values-to-attributes':
                                msgName = " ";
                                break;
                            default:
                                msgName = item.name;
                                break;
                        }
                        if (res.success) {
                            this.successLogs.push('Row: ' + i + ' - ' + msgName + ' successfully added.');
                        } else {
                            this.errorLogs.push('Row: ' + i + ' - ' + msgName + ' encountered error. (' + res.error + ')');
                        }
                        this.progressBarValue = ((i / total) * 100).toFixed(2);
                        const elem = document.getElementById('data');
                        elem.scrollTop = elem.scrollHeight;
                        if (i === total) {
                            this.uploadCompleted = true;
                        }
                        i++;
                    });
                } catch (e) {
                    this.errorLogs.push('Row: ' + i + ' - ' + msgName + ' encountered error.');
                    this.toastr.addToast({title: 'Error', msg: e.message, type: 'error'});
                    i++;
                }
            }
        } catch (e) {
            this.toastr.addToast({title: 'Data Error', msg: e.message, type: 'error'});
            this.uploadCompleted = true;
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async closeUploadModal(){
        this.toastr.addToast({title: 'Please wait', msg: "clearing queue cache", type: 'wait'});
        await this.delay(1000);
        this.forCloseModal.nativeElement.click();
        location.reload();
    }
}
