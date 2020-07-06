import { Injectable } from '@angular/core';

export interface NavigationItem {
    id: string;
    title: string;
    type: 'item' | 'collapse' | 'group';
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    external?: boolean;
    target?: boolean;
    breadcrumbs?: boolean;
    function?: any;
    badge?: {
        title?: string;
        type?: string;
    };
    children?: Navigation[];
}

export interface Navigation extends NavigationItem {
    children?: NavigationItem[];
}
const NavigationItems = [
    {
        id: 'navigation',
        title: 'CMS',
        type: 'group',
        icon: 'feather icon-monitor',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                icon: 'feather icon-home',
                url: '/public',
                breadcrumbs: false
            },
            {
                id: 'users',
                title: 'Users',
                type: 'collapse',
                icon: 'feather icon-users',
                children: [
                    {
                        id: 'add',
                        title: 'Add User',
                        type: 'item',
                        url: '/public/add-user',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Users',
                        type: 'item',
                        url: '/public/view-user',
                        target: false
                    }
                ]
            },
            {
                id: 'brands',
                title: 'Brands',
                type: 'collapse',
                icon: 'feather icon-box',
                children: [
                    {
                        id: 'add',
                        title: 'Add Brands',
                        type: 'item',
                        url: '/public/add-brands',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Brands',
                        type: 'item',
                        url: '/public/view-brands',
                        target: false
                    },
                ]
            },
            {
                id: 'categories',
                title: 'Categories',
                type: 'collapse',
                icon: 'feather icon-server',
                children: [
                    {
                        id: 'add',
                        title: 'Add Category',
                        type: 'item',
                        url: '/public/add-category',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Categories',
                        type: 'item',
                        url: '/public/view-categories',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'Index Categories',
                        type: 'item',
                        url: '/public/index-categories',
                        target: false
                    }
                ]
            },
            {
                id: 'attributGroup',
                title: 'Attribute Group',
                type: 'collapse',
                icon: 'feather icon-grid',
                children: [
                    {
                        id: 'add',
                        title: 'Add Attribute Group',
                        type: 'item',
                        url: '/public/add-attribute-group',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Attribute Group',
                        type: 'item',
                        url: '/public/view-attribute-group',
                        target: false
                    }
                ]
            },
            {
                id: 'attributes',
                title: 'Attributes',
                type: 'collapse',
                icon: 'feather icon-layers',
                children: [
                    {
                        id: 'add',
                        title: 'Add Attributes',
                        type: 'item',
                        url: '/public/add-attribute',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Attributes',
                        type: 'item',
                        url: '/public/view-attributes',
                        target: false
                    },
                    {
                        id: 'add',
                        title: 'Add Joint Attributes',
                        type: 'item',
                        url: '/public/add-joint-attribute',
                        target: false
                    },
                ]
            },
            {
                id: 'attributes-value',
                title: 'Attribute Values',
                type: 'collapse',
                icon: 'feather icon-feather',
                children: [
                    {
                        id: 'add',
                        title: 'Add Attribute Values',
                        type: 'item',
                        url: '/public/add-attribute-value',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Attributes Values',
                        type: 'item',
                        url: '/public/view-attribute-value',
                        target: false
                    }
                ]
            },
            {
                id: 'units',
                title: 'Units',
                type: 'collapse',
                icon: 'feather icon-triangle',
                children: [
                    {
                        id: 'add',
                        title: 'Add Units',
                        type: 'item',
                        url: '/public/add-unit',
                        target: false
                    },
                    {
                        id: 'view',
                        title: 'View Units',
                        type: 'item',
                        url: '/public/view-units',
                        target: false
                    }
                ]
            },
            {
                id: 'products',
                title: 'Products',
                type: 'collapse',
                icon: 'feather icon-package',
                children: [
                    {
                        id: 'button',
                        title: 'Add Products',
                        type: 'item',
                        url: '/public/add-product'
                    },
                    {
                        id: 'button',
                        title: 'View Products',
                        type: 'item',
                        url: '/public/view-product'
                    },
                    {
                        id: 'button',
                        title: 'Product Images',
                        type: 'item',
                        url: '/public/product-images'
                    },
                    {
                        id: 'button',
                        title: 'Bulk Assign Attributes',
                        type: 'item',
                        url: '/public/bulk-assign-attributes'
                    },
                    // {
                    //     id: 'button',
                    //     title: 'Edit Product Details',
                    //     type: 'item',
                    //     url: '/public/edit-complete-product'
                    // },
                ]
            },
            {
                id: 'cross_reference',
                title: 'Cross Reference',
                type: 'collapse',
                icon: 'feather icon-copy',
                children: [
                    {
                        id: 'button',
                        title: 'Add Cross Ref',
                        type: 'item',
                        url: '/public/add-cross-reference'
                    },
                    {
                        id: 'button',
                        title: 'View Cross Refs',
                        type: 'item',
                        url: '/public/view-cross-reference'
                    },
                    {
                        id: 'button',
                        title: 'Add Web Cross Ref',
                        type: 'item',
                        url: '/public/add-web-cross-reference'
                    },
                    {
                        id: 'button',
                        title: 'View Web Cross Refs',
                        type: 'item',
                        url: '/public/view-web-cross-reference'
                    },
                    {
                        id: 'button',
                        title: 'Add Cross Ref Details',
                        type: 'item',
                        url: '/public/add-cross-reference-details'
                    },
                    {
                        id: 'button',
                        title: 'View Cross Ref Details',
                        type: 'item',
                        url: '/public/view-cross-reference-details'
                    },
                    {
                        id: 'button',
                        title: 'Update Price',
                        type: 'item',
                        url: '/public/cross-reference-update-price'
                    }
                ]
            },
            {
                id: 'basic',
                title: 'Websites',
                type: 'collapse',
                icon: 'feather icon-upload-cloud',
                children: [
                    {
                        id: 'button',
                        title: 'Add Websites',
                        type: 'item',
                        url: '/public/add-website'
                    },
                    {
                        id: 'badges',
                        title: 'View Websites',
                        type: 'item',
                        url: '/public/view-website'
                    },
                    {
                        id: 'button',
                        title: 'View Products By Website',
                        type: 'item',
                        url: '/public/view-products-website'
                    }
                ]
            }
        ]
    },
    {
        id: 'navigation2',
        title: 'OMS',
        type: 'group',
        children: [
            {
                id: 'basic',
                title: 'Customers',
                type: 'collapse',
                icon: 'feather icon-user-check',
                children: [
                    {
                        id: 'button',
                        title: 'View Customers',
                        type: 'item',
                        url: '/public/oms/view-customers'
                    }
                ]
            },
            {
                id: 'basic',
                title: 'Orders',
                type: 'collapse',
                icon: 'feather icon-shopping-cart',
                children: [
                    {
                        id: 'button',
                        title: 'View Orders',
                        type: 'item',
                        url: '/public/oms/view-orders'
                    }
                ]
            }
        ]
    }
];

@Injectable()
export class NavigationItem {
    public get() {
        return NavigationItems;
    }
}
