import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NgbModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbCarouselModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

// 3rd party items
import { DataTablesModule } from 'angular-datatables';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { TagInputModule } from 'ngx-chips';
import { ToastyModule } from 'ng2-toasty';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FileUploadModule } from '@iplab/ngx-file-upload';


// Custom Theme
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { ToggleFullScreenDirective } from './theme/shared/full-screen/toggle-full-screen';

import { AppComponent } from './app.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ChatUserListComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { ChatMsgComponent } from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';


///////////  Extras
import { DxTreeViewModule } from 'devextreme-angular';
import { DxHtmlEditorModule } from 'devextreme-angular';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgSelectModule } from '@ng-select/ng-select';
import { TinymceModule } from 'angular2-tinymce';

//////  Layouts
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { UploaderComponent } from './cms/components/uploader/uploader.component';


//Auth
import { AuthInterceptor } from './cms/auth/auth.interceptor';

///// Components
import { AuthSigninComponent } from './cms/pages/auth-signin/auth-signin.component';
import { DashboardComponent } from './cms/pages/dashboard/dashboard.component';
import { AddUserComponent } from './cms/pages/users/add-user/add-user.component';
import { ViewUserComponent } from './cms/pages/users/view-user/view-user.component';
import { EditUserComponent } from './cms/pages/users/edit-user/edit-user.component';
import { AddCategoryComponent } from './cms/pages/categories/add-category/add-category.component';
import { EditCategoryComponent } from './cms/pages/categories/edit-category/edit-category.component';
import { ViewCategoriesComponent } from './cms/pages/categories/view-categories/view-categories.component';
import { AddAttributeGroupComponent } from './cms/pages/attribute-group/add-attribute-group/add-attribute-group.component';
import { ViewAttributeGroupComponent } from './cms/pages/attribute-group/view-attribute-group/view-attribute-group.component';
import { EditAttributeGroupComponent } from './cms/pages/attribute-group/edit-attribute-group/edit-attribute-group.component';
import { ViewBrandComponent } from './cms/pages/brands/view-brands/view-brand.component';
import { EditBrandComponent } from './cms/pages/brands/edit-brands/edit-brand.component';
import { AddBrandComponent } from './cms/pages/brands/add-brands/add-brand.component';
import { IndexCategoriesComponent } from './cms/pages/categories/index-categories/index-categories.component';
import { ViewProductComponent } from './cms/pages/products/view-products/view-product.component';
import { EditProductComponent } from './cms/pages/products/edit-products/edit-product.component';
import { AddProductComponent } from './cms/pages/products/add-products/add-product.component';
import { AddAttributeComponent } from './cms/pages/attributes/add-attribute/add-attribute.component';
import { EditAttributeComponent } from './cms/pages/attributes/edit-attribute/edit-attribute.component';
import { ViewAttributeComponent } from './cms/pages/attributes/view-attribute/view-attribute.component';
import { AssignAttributeProductComponent } from './cms/pages/products/assign-attribute-product/assign-attribute-product.component';
import { AddWebsitesComponent } from './cms/pages/websites/add-websites/add-websites.component';
import { ViewWebsitesComponent } from './cms/pages/websites/view-websites/view-websites.component';
import { EditWebsiteComponent } from './cms/pages/websites/edit-website/edit-website.component';
import { AssignProductToWebsiteComponent } from './cms/pages/websites/assign-product-to-website/assign-product-to-website.component';
import { ViewProductsWebsiteComponent } from './cms/pages/websites/view-products-website/view-products-website.component';
import { EditAssignedProductWebsiteComponent } from './cms/pages/websites/edit-assigned-product-website/edit-assigned-product-website.component';
import { ViewUnitComponent } from './cms/pages/units/view-unit/view-unit.component';
import { AddUnitComponent } from './cms/pages/units/add-unit/add-unit.component';
import { EditUnitComponent } from './cms/pages/units/edit-unit/edit-unit.component';
import { EditCompleteProductComponent } from './cms/pages/products/edit-complete-product/edit-complete-product.component';
import { DetailProductComponent } from './cms/pages/products/detail-product/detail-product.component';
import { PageNotFoundComponent } from './cms/pages/others/page-not-found/page-not-found-error.component';
import { MaintenancePageComponent } from './cms/pages/others/maintenance-page/maintenance-page.component';
import { ViewCrossReferenceComponent } from './cms/pages/cross-reference/view-cross-reference/view-cross-reference.component';
import { AddCrossReferenceComponent } from './cms/pages/cross-reference/add-cross-reference/add-cross-reference.component';
import { AddCrossReferenceDetailsComponent } from './cms/pages/cross-reference-details/add-cross-reference-details/add-cross-reference-details.component';
import { ViewCrossReferenceDetailsComponent } from './cms/pages/cross-reference-details/view-cross-reference-details/view-cross-reference-details.component';
import { EditCrossReferenceComponent } from './cms/pages/cross-reference/edit-cross-reference/edit-cross-reference.component';
import { AddWebCrossReferenceComponent } from './cms/pages/cross-reference/add-web-cross-reference/add-web-cross-reference.component';
import { ViewWebCrossReferenceComponent } from './cms/pages/cross-reference/view-web-cross-reference/view-web-cross-reference.component';
import { EditWebCrossReferenceComponent } from './cms/pages/cross-reference/edit-web-cross-reference/edit-web-cross-reference.component';
import { EditCrossReferenceDetailsComponent } from './cms/pages/cross-reference-details/edit-cross-reference-details/edit-cross-reference-details.component';
import { UpdatePricesComponent } from './cms/pages/cross-reference/update-prices/update-prices.component';
import { AddAttributeValueComponent } from './cms/pages/attribute-value/add-attribute-value/add-attribute-value.component';
import { EditAttributeValueComponent } from './cms/pages/attribute-value/edit-attribute-value/edit-attribute-value.component';
import { ViewAttributeValueComponent } from './cms/pages/attribute-value/view-attribute-value/view-attribute-value.component';
import { ViewOrdersComponent } from './cms/pages/oms/orders/view-orders/view-orders.component';
import { AddJointAttributeComponent } from './cms/pages/attributes/add-joint-attribute/add-joint-attribute.component';
import { BulkAssignAttributeComponent } from './cms/pages/products/bulk-assign-attribute/bulk-assign-attribute.component';
import { ViewCustomersComponent } from './cms/pages/oms/customers/view-customers/view-customers.component';
import { ProductImagesComponent } from './cms/pages/products/product-images/product-images.component';
import { WebsiteSettingComponent } from './cms/pages/websites/website-setting/website-setting.component';


import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './cms/services/timeout-Interceptor';
@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        AuthComponent,
        NavigationComponent,
        NavContentComponent,
        NavGroupComponent,
        NavCollapseComponent,
        NavItemComponent,
        NavBarComponent,
        NavLeftComponent,
        NavSearchComponent,
        NavRightComponent,
        ChatUserListComponent,
        FriendComponent,
        ChatMsgComponent,
        ConfigurationComponent,
        ToggleFullScreenDirective,

        //Others
        PageNotFoundComponent,
        MaintenancePageComponent,

        // Components
        AuthSigninComponent,
        DashboardComponent,
        AddUserComponent,
        EditUserComponent,
        ViewUserComponent,
        EditBrandComponent,
        AddBrandComponent,
        ViewBrandComponent,
        AddCategoryComponent,
        EditCategoryComponent,
        ViewCategoriesComponent,
        AddAttributeGroupComponent,
        ViewAttributeGroupComponent,
        EditAttributeGroupComponent,
        IndexCategoriesComponent,
        ViewProductComponent,
        EditProductComponent,
        EditCompleteProductComponent,
        AddProductComponent,
        AddAttributeComponent,
        EditAttributeComponent,
        ViewAttributeComponent,
        AssignAttributeProductComponent,
        AddWebsitesComponent,
        ViewWebsitesComponent,
        EditWebsiteComponent,
        AssignProductToWebsiteComponent,
        ViewProductsWebsiteComponent,
        EditAssignedProductWebsiteComponent,
        UploaderComponent,
        ViewUnitComponent,
        AddUnitComponent,
        EditUnitComponent,
        DetailProductComponent,
        WebsiteSettingComponent,

        AddCrossReferenceComponent,
        ViewCrossReferenceComponent,
        AddCrossReferenceDetailsComponent,
        ViewCrossReferenceDetailsComponent,
        EditCrossReferenceComponent,
        AddWebCrossReferenceComponent,
        ViewWebCrossReferenceComponent,
        EditWebCrossReferenceComponent,
        EditCrossReferenceDetailsComponent,
        UpdatePricesComponent,
        AddAttributeValueComponent,
        EditAttributeValueComponent,
        ViewAttributeValueComponent,
        ViewOrdersComponent,
        ViewCustomersComponent,
        AddJointAttributeComponent,
        BulkAssignAttributeComponent,
        ProductImagesComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbButtonsModule,
        NgbTabsetModule,
        FormsModule,
        ReactiveFormsModule,
        NgbCarouselModule,
        NgbProgressbarModule,
        NgbModule,
        NgbPopoverModule,
        NgbPaginationModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),

        // From Theme ///////////
        DataTablesModule,
        AngularDualListBoxModule,
        TagInputModule,
        ToastyModule.forRoot(),
        CarouselModule,
        FileUploadModule,
        NgSelectModule,
        TinymceModule,

        // Other
        NgxErrorsModule,
        DxTreeViewModule,
        DxHtmlEditorModule
    ],
    providers: [
        NavigationItem,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
        [{ provide: DEFAULT_TIMEOUT, useValue: 30000 }]
    ],
    bootstrap: [AppComponent],
    exports: [BrowserModule, ToastyModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    entryComponents: [
        UploaderComponent
    ]
})


export class AppModule {
}