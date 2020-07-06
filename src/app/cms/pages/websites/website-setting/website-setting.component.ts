import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'

@Component({
  selector: 'app-website-setting',
  templateUrl: './website-setting.component.html',
  styleUrls: ['./website-setting.component.scss']
})
export class WebsiteSettingComponent implements OnInit {

  submitLoader = false;
  websiteID: any;
  selectedWebsite: any;

  headerMenuList = [];
  headerAssignedCategoryList = [];
  headerMenuID: any;

  categoryDropDown = [];
  featuredCategoriesList = [];
  featuredCategoriesID: any;

  bannerForUpload = null;
  selectedBannerName = 'Please select banner image';
  selectedBannerTitle = null;
  bannerImagesList = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToasterService
  ) { }

  ngOnInit() {
    this.websiteID = this.route.snapshot.paramMap.get('id');
    this.submitLoader = false;
    this.loadCategoryDropBox();
    this.getWebsiteByID();
    this.getWebsiteSettings();
    this.loadBannerImages();
  }


  async getWebsiteByID() {
    try {
      this.http.get(`${environment.host}website/${this.websiteID}`).subscribe((res: any) => {
        if (res.success) this.selectedWebsite = res.data
        else this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async getWebsiteSettings() {
    try {
      this.http.get(`${environment.host}website/${this.websiteID}/settings`).subscribe(async (res: any) => {
        if (res.success) {
          res.data.forEach(async (item) => {
            if (item.category && item.setting_key && item.category == "menu" && item.setting_key == "header-menu") {
              this.headerMenuList = await JSON.parse(item.setting_value);
              this.headerMenuID = item.id;
            }
            if (item.category && item.setting_key && item.category == "homepage" && item.setting_key == "featured_categories") {
              this.featuredCategoriesList = await JSON.parse(item.setting_value);
              this.featuredCategoriesID = item.id;
            }
          });
        }
        else
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }


  //Heade Menu Section
  async loadAssignedCategoryDropBox() {
    try {
      this.http.get(environment.host + 'category').subscribe(async (res: any) => {
        if (res.success) this.headerAssignedCategoryList = res.data;
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async addNewHeaderMenu() {
    this.headerMenuList.push({
      title: "",
      url: "",
      childList: []
    });
  }

  async addNewChildHeaderMenu(i: any, j?: any) {
    if (j || j >= 0) {
      this.headerMenuList[i].childList[j].childList.push({
        title: "",
        url: "",
        childList: []
      });
    } else {
      this.headerMenuList[i].childList.push({
        title: "",
        url: "",
        childList: []
      });
    }
  }

  async deleteHeaderMenu(i: any, j?: any, k?: any) {
    if (k || k >= 0) {
      this.headerMenuList[i].childList[j].childList.splice(k, 1);
    } else if (j || j >= 0) {
      this.headerMenuList[i].childList.splice(j, 1);
    } else {
      this.headerMenuList.splice(i, 1);
    }
  }

  async onSubmitHeaderMenu() {
    this.submitLoader = true;
    const body = {
      id: (this.headerMenuID ? this.headerMenuID : null),
      website_id: this.websiteID,
      category: "menu",
      setting_key: "header-menu",
      setting_value: JSON.stringify(this.headerMenuList),
      active: 1,
    };

    try {
      this.http.post(`${environment.host}website/${this.websiteID}/settings/header-menu`, body).subscribe(async (res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.submitLoader = false;
        }
        else {
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
          this.submitLoader = false;
        }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
      this.submitLoader = false;
    }
  }


  //Featured Categories
  async loadCategoryDropBox() {
    try {
      this.http.get(environment.host + 'category').subscribe(async (res: any) => {
        if (res.success) this.categoryDropDown = res.data;
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async addNewCategoryRow() {
    this.featuredCategoriesList.push({
      category_id: null,
      sub_category_ids: []
    });
  }

  async deleteCategoryRow(i: any) {
    this.featuredCategoriesList.splice(i, 1);
  }

  async onSubmitFeaturedCategories() {
    this.submitLoader = true;
    const body = {
      id: (this.featuredCategoriesID ? this.featuredCategoriesID : null),
      website_id: this.websiteID,
      category: "homepage",
      setting_key: "featured_categories",
      setting_value: JSON.stringify(this.featuredCategoriesList),
      active: 1,
    };

    try {
      this.http.post(`${environment.host}website/${this.websiteID}/settings/featured-categories`, body).subscribe(async (res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.submitLoader = false;
        }
        else {
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
          this.submitLoader = false;
        }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
      this.submitLoader = false;
    }
  }


  //Banner Images
  async loadBannerImages() {
    try {
      this.bannerImagesList = [];
      this.http.get(`${environment.host}website/${this.websiteID}/settings/banner-images`).subscribe(async (res: any) => {
        if (res.success) {
          this.bannerImagesList = res.data;
        }
      });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  async bannerInput(e) {
    this.bannerForUpload = e.target.files[0];
    if (this.bannerForUpload) {
      // const reader = new FileReader();
      // reader.onload = this.handleReaderLoaded.bind(this);
      // reader.readAsBinaryString(this.bannerForUpload);
      this.selectedBannerName = e.target.files[0].name;
    }
  }

  async onDeleteBannerImage(i) {
    console.log(i);
    // this.bannerImagesList.splice(i, 1);
  }


  async onSubmitBannerImages() {
    try {
      if(this.bannerForUpload && this.selectedBannerTitle) {
      this.submitLoader = true;
      this.toastr.addToast({ title: 'Please wait', msg: 'Uploading banner', type: 'wait' });
      const banner = new FormData();
      banner.append('banner', this.bannerForUpload, this.selectedBannerName);
      this.http.post(`${environment.host}website/${this.websiteID}/settings/banner-images/upload` , banner).subscribe((res: any) => {
        if (res.success) {
          this.toastr.addToast({ title: 'Success', msg: 'Banner Uploaded Successfully', type: 'success' });
          this.toastr.addToast({ title: 'Please wait', msg: 'Saving details', type: 'wait' });
          this.bannerImagesList.push({
            title: this.selectedBannerTitle,
            image: this.selectedBannerName
          });
          this.http.post(`${environment.host}website/${this.websiteID}/settings/banner-images` , {data: this.bannerImagesList}).subscribe((res2: any) => {
            if(res2.success) {
              this.toastr.addToast({ title: 'Success', msg: 'Banner Added to Database', type: 'success' });
              this.loadBannerImages();
              this.submitLoader = false;
            } else {
              this.toastr.addToast({ title: 'Error', msg: res2.message, type: 'error' });
              this.submitLoader = false;
            }
          });
        } else {
          this.toastr.addToast({ title: 'Error', msg: res.message, type: 'error' });
          this.submitLoader = false;
        }
      });
    } else {
      this.toastr.addToast({ title: 'Error', msg: "Please provide valid details", type: 'error' });
    }
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
      this.submitLoader = false;
    }
  }
}
