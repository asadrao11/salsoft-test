import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

import { ToasterService } from 'src/app/cms/services/toaster.service';
import { UploaderComponent } from '../components/uploader/uploader.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UploaderService {

    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    private uploadType = '';
    private uploadData = [];

    constructor(
        private modalService: NgbModal,
        private toastr: ToasterService,
        private http: HttpClient,
    ) {
    }


    async read_Excel_File(file, type) {
        try {
            const reader: FileReader = new FileReader();
            reader.readAsBinaryString(await file);
            reader.onload = async (e: any) => {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                const data = await XLSX.utils.sheet_to_json(ws, { header: 1 });
                this.uploadType = type;
                switch (type) {
                    case 'users':
                        await this.load_Users_Upload_Data(data);
                        break;
                    case 'brands':
                        await this.load_Brands_Upload_Data(data);
                        break;
                    case 'attribute-groups':
                        await this.load_Attribute_Groups_Upload_Data(data);
                        break;
                    case 'websites':
                        await this.load_Websites_Upload_Data(data);
                        break;
                    case 'categories':
                        await this.load_Categories_Upload_Data(data);
                        break;
                    case 'attributes':
                        await this.load_Attributes_Upload_Data(data);
                        break;
                    case 'attribute-values':
                        await this.load_Attribute_Values_Upload_Data(data);
                        break;
                    case 'units':
                        await this.load_Units_Upload_Data(data);
                        break;
                    case 'products':
                        await this.load_Products_Upload_Data(data);
                        break;
                    case 'assign-attribute-group-to-product':
                        await this.load_Assign_AttributeGroup_To_Product_Upload_Data(data);
                        break;
                    case 'assign-attribute-to-product':
                        await this.load_Assign_Attribute_To_Product_Upload_Data(data);
                        break;
                    case 'assign-product-to-website':
                        await this.load_Assign_Product_To_Website_Upload_Data(data);
                        break;
                    case 'assign-image-to-product':
                        await this.load_Assign_Image_To_Product_Upload_Data(data);
                        break;
                    case 'assign-values-to-attributes':
                        await this.load_Assign_Values_To_Attributes_Upload_Data(data);
                        break;
                }
            };
            await this.delay(1000);
            console.log('read excel file: ', this.uploadData);
            return this.uploadData;
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }

    start_Upload() {
        console.log('start uploading: ', this.uploadData);
        if (this.uploadType && this.uploadData.length > 0) {
            const options: any = {
                scrollable: true,
                centered: true,
                size: 'lg'
            };
            const modalRef = this.modalService.open(UploaderComponent, options);
            modalRef.componentInstance.type = this.uploadType;
            modalRef.componentInstance.data = this.uploadData;
        } else {
            this.toastr.addToast({ title: 'Upload Error', msg: 'Data was not loaded correctly', type: 'error' });
        }
    }

    async load_Users_Upload_Data(unFormatedData) {
        this.uploadData = [];
        if (unFormatedData[0][0] === 'Email' && unFormatedData[0][1] === 'Password' && unFormatedData[0][2] === 'Name' && unFormatedData[0][3] === 'Type' && unFormatedData[0][4] === 'Status (0/1)') {
            if (unFormatedData.length > 1) {
                for (let i = 1; i < unFormatedData.length; i++) {
                    const data = {
                        email: unFormatedData[i][0],
                        password: unFormatedData[i][1],
                        name: unFormatedData[i][2],
                        role: unFormatedData[i][3],
                        active: unFormatedData[i][4]
                    };
                    this.uploadData.push(data);
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
            }
        } else {
            this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
        }
    }


    async load_Brands_Upload_Data(unFormatedData) {
        this.uploadData = [];
        if (unFormatedData[0][0] === 'Brand Name' && unFormatedData[0][1] === 'Status (0/1)') {
            if (unFormatedData.length > 1) {
                for (let i = 1; i < unFormatedData.length; i++) {
                    const data = {
                        name: unFormatedData[i][0],
                        active: unFormatedData[i][1]
                    };
                    this.uploadData.push(data);
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
            }
        } else {
            this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
        }
    }


    async load_Attribute_Groups_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            console.log(unFormatedData);
            if (unFormatedData[0][0] === 'Attribute Group Name' && unFormatedData[0][1] === 'Status (0/1)') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            name: unFormatedData[i][0],
                            active: unFormatedData[i][1]
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Websites_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            console.log(unFormatedData);
            if (unFormatedData[0][0] === 'Website Name' && unFormatedData[0][1] === 'Status (0/1)') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            name: unFormatedData[i][0],
                            active: unFormatedData[i][1],
                            created_by: localStorage.getItem('user'),
                            updated_by: localStorage.getItem('user'),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Categories_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            console.log(unFormatedData);
            if (unFormatedData[0][0] === 'Category Name' && unFormatedData[0][1] === 'Parent Category ID' && unFormatedData[0][2] === 'Status (0/1)') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            name: unFormatedData[i][0],
                            parent_id: unFormatedData[i][1],
                            active: unFormatedData[i][2],
                            created_by: localStorage.getItem('user'),
                            updated_by: localStorage.getItem('user'),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Attributes_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Attribute Title'
                && unFormatedData[0][1] === 'Short Code'
                && unFormatedData[0][2] === 'Attribute Group IDs'
                && unFormatedData[0][3] === 'Type'
                && unFormatedData[0][4] === 'Is Filter (0/1)'
                && unFormatedData[0][5] === 'Status (0/1)') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        let attributeGroup = [];
                        const atbGroup = (unFormatedData[i][2] + "").split(',');
                        // atbGroup.forEach(async d => {
                        //     let temp = { id: 0, name: '' };
                        //     temp.id = Number(d);
                        //     this.http.get(environment.host + 'attributeGroup/' + temp.id).subscribe(async (res: any) => { temp.name = await res.success ? res.data.name : "Not Found"; });
                        //     attributeGroup.push(temp);
                        // });
                        attributeGroup = atbGroup;
                        const data = {
                            title: unFormatedData[i][0],
                            short_code: unFormatedData[i][1],
                            attributeGroups: attributeGroup,
                            type: unFormatedData[i][3],
                            is_filter: unFormatedData[i][4],
                            active: unFormatedData[i][5],
                            created_by: localStorage.getItem('user'),
                            updated_by: localStorage.getItem('user'),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Attribute_Values_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Value') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        // const data = {
                        //     attribute_id: unFormatedData[i][0],
                        //     name: '',
                        //     value: unFormatedData[i][1],
                        // };
                        // this.http.get(environment.host + 'attribute/' + data.attribute_id).subscribe(async (res: any) => { data.name = await res.success ? res.data.title : "Not Found"; });
                        // this.uploadData.push(data);
                        
                        const data = {
                            value: unFormatedData[i][0]
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Units_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Unit Title'
                && unFormatedData[0][1] === 'Short Code'
                && unFormatedData[0][2] === 'Attribute IDs'
                && unFormatedData[0][3] === 'Status (0/1)') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        let attributes = (unFormatedData[i][2] + "").split(',');
                        const data = {
                            title: unFormatedData[i][0],
                            short_code: unFormatedData[i][1],
                            attributes: attributes,
                            active: unFormatedData[i][3],
                            created_by: localStorage.getItem('user'),
                            updated_by: localStorage.getItem('user'),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Products_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Product Name'
                && unFormatedData[0][1] === 'SKU'
                && unFormatedData[0][2] === 'Category ID'
                && unFormatedData[0][3] === 'Brand ID'
                && unFormatedData[0][4] === 'Description'
                && unFormatedData[0][5] === 'Status (0/1)'
            ) {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            name: unFormatedData[i][0],
                            SKU: unFormatedData[i][1],
                            category_id: unFormatedData[i][2],
                            brand_id: unFormatedData[i][3],
                            attribute_group_id: null,
                            description: unFormatedData[i][4],
                            active: unFormatedData[i][5],
                            created_by: localStorage.getItem('user'),
                            updated_by: localStorage.getItem('user'),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Assign_AttributeGroup_To_Product_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Product ID'
                && unFormatedData[0][1] === 'Attribute Group ID'
            ) {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            product_id: unFormatedData[i][0],
                            attribute_group_id: unFormatedData[i][1],
                            // product_name: '',
                            // attribute_group_name: '',
                        };
                        // this.http.get(environment.host + 'product/' + data.product_id).subscribe(async (res: any) => { data.product_name = await res.success ? res.data.name : "Not Found"; });
                        // this.http.get(environment.host + 'attributeGroup/' + data.attribute_group_id).subscribe(async (res: any) => { data.attribute_group_name = await res.success ? res.data.name : "Not Found"; });
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Assign_Attribute_To_Product_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Product ID'
                && unFormatedData[0][1] === 'Attribute ID'
                && unFormatedData[0][2] === 'Unit ID'
                && unFormatedData[0][3] === 'Value'
            ) {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            product_id: unFormatedData[i][0],
                            attribute_id: unFormatedData[i][1],
                            attribute_unit_id: unFormatedData[i][2],
                            value: unFormatedData[i][3],
                            // product_name: '',
                            // attribute_name: '',
                            // unit_name: '',
                        };
                        // this.http.get(environment.host + 'product/' + data.product_id).subscribe(async (res: any) => { data.product_name = await res.success ? (res.data.name ? res.data.name : res.data.title) : "Not Found"; });
                        // this.http.get(environment.host + 'attribute/' + data.attribute_id).subscribe(async (res: any) => { data.attribute_name = await res.success ? (res.data.name ? res.data.name : res.data.title) : "Not Found"; });
                        // this.http.get(environment.host + 'unit/' + data.attribute_unit_id).subscribe(async (res: any) => { data.unit_name = await res.success ? (res.data.name ? res.data.name : res.data.title) : "Not Found"; });
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Assign_Values_To_Attributes_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Category IDs'
                && unFormatedData[0][1] === 'Attribute IDs'
                && unFormatedData[0][2] === 'Value IDs'
            ) {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            categories: (unFormatedData[i][0] + "").split(','),
                            attributes: (unFormatedData[i][1] + "").split(','),
                            values: (unFormatedData[i][2] + "").split(','),
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Assign_Product_To_Website_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            if (unFormatedData[0][0] === 'Website ID'
                && unFormatedData[0][1] === 'Product ID'
                && unFormatedData[0][2] === 'Name'
                && unFormatedData[0][3] === 'Price'
                && unFormatedData[0][4] === 'Cost'
                && unFormatedData[0][5] === 'Quantity'
                && unFormatedData[0][6] === 'Show Price (0/1)'
                && unFormatedData[0][7] === 'Is In Stock (0/1)'
                && unFormatedData[0][8] === 'Status (0/1)'
            ) {
                console.log(unFormatedData.length);
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            website_id: unFormatedData[i][0],
                            product_id: unFormatedData[i][1],
                            name: unFormatedData[i][2],
                            price: unFormatedData[i][3],
                            cost: unFormatedData[i][4],
                            qty: unFormatedData[i][5],
                            show_price: unFormatedData[i][6],
                            is_in_stock: unFormatedData[i][7],
                            active: unFormatedData[i][8],
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


    async load_Assign_Image_To_Product_Upload_Data(unFormatedData) {
        try {
            this.uploadData = [];
            console.log(unFormatedData);
            if (unFormatedData[0][0] === 'Product SKU' && unFormatedData[0][1] === 'Image Name') {
                if (unFormatedData.length > 1) {
                    for (let i = 1; i < unFormatedData.length; i++) {
                        const data = {
                            product_sku: unFormatedData[i][0],
                            image: unFormatedData[i][1]
                        };
                        this.uploadData.push(data);
                    }
                } else {
                    this.toastr.addToast({ title: 'Error', msg: 'No Data Found', type: 'error' });
                }
            } else {
                this.toastr.addToast({ title: 'Error', msg: 'Data is not in correct format', type: 'error' });
            }
        } catch (e) {
            this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
        }
    }


















    // Extra Functions
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
