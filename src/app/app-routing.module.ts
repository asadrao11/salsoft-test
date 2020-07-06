import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Layouts
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AuthGuard } from './cms/auth/auth.guard';
//Components
import { AuthSigninComponent } from './cms/pages/auth-signin/auth-signin.component';
import { DashboardComponent } from './cms/pages/dashboard/dashboard.component';
import { AddUserComponent } from './cms/pages/users/add-user/add-user.component';
import { ViewUserComponent } from './cms/pages/users/view-user/view-user.component';
import { AddBrandComponent } from './cms/pages/brands/add-brands/add-brand.component';
import { ViewBrandComponent } from './cms/pages/brands/view-brands/view-brand.component';
import { EditUserComponent } from './cms/pages/users/edit-user/edit-user.component';
import { EditBrandComponent } from './cms/pages/brands/edit-brands/edit-brand.component';
import { AddCategoryComponent } from './cms/pages/categories/add-category/add-category.component';
import { EditCategoryComponent } from './cms/pages/categories/edit-category/edit-category.component';
import { ViewCategoriesComponent } from './cms/pages/categories/view-categories/view-categories.component';
import { AddAttributeGroupComponent } from './cms/pages/attribute-group/add-attribute-group/add-attribute-group.component';
import { ViewAttributeGroupComponent } from './cms/pages/attribute-group/view-attribute-group/view-attribute-group.component';
import { EditAttributeGroupComponent } from './cms/pages/attribute-group/edit-attribute-group/edit-attribute-group.component';
import { IndexCategoriesComponent } from './cms/pages/categories/index-categories/index-categories.component';
import { AddProductComponent } from './cms/pages/products/add-products/add-product.component';
import { EditProductComponent } from './cms/pages/products/edit-products/edit-product.component';
import { ViewProductComponent } from './cms/pages/products/view-products/view-product.component';
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
import { AddUnitComponent } from './cms/pages/units/add-unit/add-unit.component';
import { EditUnitComponent } from './cms/pages/units/edit-unit/edit-unit.component';
import { ViewUnitComponent } from './cms/pages/units/view-unit/view-unit.component';
import { EditCompleteProductComponent } from './cms/pages/products/edit-complete-product/edit-complete-product.component';
import { DetailProductComponent } from './cms/pages/products/detail-product/detail-product.component';
import { PageNotFoundComponent } from './cms/pages/others/page-not-found/page-not-found-error.component';
import { MaintenancePageComponent } from './cms/pages/others/maintenance-page/maintenance-page.component';
import { AddCrossReferenceComponent } from './cms/pages/cross-reference/add-cross-reference/add-cross-reference.component';
import { ViewCrossReferenceComponent } from './cms/pages/cross-reference/view-cross-reference/view-cross-reference.component';
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



const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: AuthSigninComponent
            },
        ]
    },
    {
        path: 'public',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'add-user',
                component: AddUserComponent
            },
            {
                path: 'edit-user/:id',
                component: EditUserComponent
            },
            {
                path: 'view-user',
                component: ViewUserComponent
            },
            {
                path: 'add-brands',
                component: AddBrandComponent
            },
            {
                path: 'edit-brand/:id',
                component: EditBrandComponent
            },
            {
                path: 'view-brands',
                component: ViewBrandComponent
            },
            {
                path: 'add-category',
                component: AddCategoryComponent
            },
            {
                path: 'edit-category/:id',
                component: EditCategoryComponent
            },
            {
                path: 'view-categories',
                component: ViewCategoriesComponent
            },
            {
                path: 'index-categories',
                component: IndexCategoriesComponent
            },
            {
                path: 'add-attribute-group',
                component: AddAttributeGroupComponent
            },
            {
                path: 'edit-attribute-group/:id',
                component: EditAttributeGroupComponent
            },
            {
                path: 'view-attribute-group',
                component: ViewAttributeGroupComponent
            },
            {
                path: 'add-product',
                component: AddProductComponent
            },
            {
                path: 'product-images',
                component: ProductImagesComponent
            },
            {
                path: 'edit-product/:id',
                component: EditProductComponent
            },
            {
                path: 'edit-complete-product',
                component: EditCompleteProductComponent
            },
            {
                path: 'edit-complete-product/:id',
                component: EditCompleteProductComponent
            },
            {
                path: 'view-product',
                component: ViewProductComponent
            },
            {
                path: 'detail-product/:id',
                component: DetailProductComponent
            },
            {
                path: 'assign-attribute-product/:id',
                component: AssignAttributeProductComponent
            },
            {
                path: 'add-attribute',
                component: AddAttributeComponent
            },
            {
                path: 'add-joint-attribute',
                component: AddJointAttributeComponent
            },
            {
                path: 'edit-attribute/:id',
                component: EditAttributeComponent
            },
            {
                path: 'view-attributes',
                component: ViewAttributeComponent
            },
            {
                path: 'add-website',
                component: AddWebsitesComponent
            },
            {
                path: 'edit-website/:id',
                component: EditWebsiteComponent
            },
            {
                path: 'view-website',
                component: ViewWebsitesComponent
            },
            {
                path: 'website-setting/:id',
                component: WebsiteSettingComponent
            },
            {
                path: 'assign-product-to-website/:id',
                component: AssignProductToWebsiteComponent
            },
            {
                path: 'view-products-website',
                component: ViewProductsWebsiteComponent
            },
            {
                path: 'edit-assigned-product-website/:website_id/:product_id',
                component: EditAssignedProductWebsiteComponent
            },
            {
                path: 'add-unit',
                component: AddUnitComponent
            },
            {
                path: 'edit-unit/:id',
                component: EditUnitComponent
            },
            {
                path: 'view-units',
                component: ViewUnitComponent
            },
            {
                path: 'add-cross-reference',
                component: AddCrossReferenceComponent
            },
            {
                path: 'view-cross-reference',
                component: ViewCrossReferenceComponent
            },
            {
                path: 'edit-cross-reference/:id',
                component: EditCrossReferenceComponent
            },
            {
                path: 'add-web-cross-reference',
                component: AddWebCrossReferenceComponent
            },
            {
                path: 'view-web-cross-reference',
                component: ViewWebCrossReferenceComponent
            },
            {
                path: 'edit-web-cross-reference/:id',
                component: EditWebCrossReferenceComponent
            },
            {
                path: 'add-cross-reference-details',
                component: AddCrossReferenceDetailsComponent
            },
            {
                path: 'view-cross-reference-details',
                component: ViewCrossReferenceDetailsComponent
            },
            {
                path: 'edit-cross-reference-details/:id',
                component: EditCrossReferenceDetailsComponent
            },
            {
                path: 'cross-reference-update-price',
                component: UpdatePricesComponent
            },
            {
                path: 'add-attribute-value',
                component: AddAttributeValueComponent
            },
            {
                path: 'edit-attribute-value/:id/:type',
                component: EditAttributeValueComponent
            },
            {
                path: 'view-attribute-value',
                component: ViewAttributeValueComponent
            },
            {
                path: 'bulk-assign-attributes',
                component: BulkAssignAttributeComponent
            },
            {
                path: 'oms',
                children: [
                    {
                        path: 'view-customers',
                        component: ViewCustomersComponent
                    },
                    {
                        path: 'view-orders',
                        component: ViewOrdersComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'maintenance',
        component: MaintenancePageComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
