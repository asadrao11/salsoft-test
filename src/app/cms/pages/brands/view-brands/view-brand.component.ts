import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/cms/services/common.service';

@Component({
  selector: 'app-view-brand',
  templateUrl: './view-brand.component.html',
  styleUrls: ['./view-brand.component.scss']
})
export class ViewBrandComponent implements AfterViewInit, OnInit {


  constructor(
    private http: HttpClient,
    private toastr: ToasterService,
    private renderer: Renderer2,
    private router: Router,
    private commonService: CommonService,
  ) { }

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
    const table = $('#dataTable').DataTable();
    table.ajax.reload();
  }

  async initDataTable() {
    try {
      const that = this;
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 20,
        responsive: true,
        select: {
          style: 'multi',
          selector: 'td:first-child'
        },
        ajax: (dataTablesParameters: any, callback) => {
          $('button').removeClass('dt-button');
          that.http.get(environment.host + 'brand', dataTablesParameters).subscribe(async (res: any) => {
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
          {
            title: 'ID',
            data: 'id'
          },
          {
            title: 'Image',
            data: 'imageUrl',
            render: function (data: any, type: any, full: any) {
              if(data) {
                return `<img src="${data}" alt="brand icon" class="img-radius align-top m-r-15" style="width:40px;">`;
              } else {
                return `<img src="assets/images/brands/default-brand-icon.png" alt="brand icon" class="img-radius align-top m-r-15" style="width:40px;">`;
              }
            }
          },
          {
            title: 'Name',
            data: 'name'
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
              title: 'Created By',
              data: 'created_by',
              render: function (data: any, type: any, full: any) {
                  let user = that.commonService.AllUsers.find( x => x.id === data);
                  return user ? user.name : 'Not Found';
              }
          },
          {
              title: 'Updated By',
              data: 'updated_by',
              render: function (data: any, type: any, full: any) {
                  let user = that.commonService.AllUsers.find( x => x.id === data);
                  return user ? user.name : 'Not Found';
              }
          },
          {
            title: 'Status',
            data: 'active',
            render: function (data: any, type: any, full: any) {
              return data ? `<span class="badge badge-light-success">Active</span>` : `<span class="badge badge-light-danger">Inactive</span>`
            }
          },
          {
            title: 'Action',
            render: function (data: any, type: any, full: any) {
              return `
                            <a type="button" edit_tag="${full.id}" ngbTooltip="Edit Brand">
                                <i edit_tag="${full.id}" class="icon feather icon-edit f-16 text-c-green"></i>
                            </a>
                            <a type="button" delete_tag="${full.id}" ngbTooltip="Delete Brand">
                                <i delete_tag="${full.id}" class="icon feather icon-trash-2 f-16 ml-3 text-c-red"></i>
                            </a>`
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
      text: 'You want to bulk delete ' + (data.length ? data.length : 0) + ' brands.',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.toastr.addToast({ title: 'Please wait', msg: 'Deleting brands', type: 'wait' });
        this.http.post(environment.host + 'brand/bulkDelete', { data }).subscribe((res: any) => {
          if (res.success) {
            this.reload();
            Swal.fire(
              'Deleted!',
              'Brands has been deleted.',
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
        this.http.delete(environment.host + 'brand/' + id).subscribe((res: any) => {
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


}
