import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { ToasterService } from 'src/app/cms/services/toaster.service'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  dtOptions: any;

  constructor(
    private http: HttpClient,
    private toastr: ToasterService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit() {
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("edit_tag")) {
        const id = event.target.getAttribute("edit_tag");
        this.router.navigate(["/public/edit-user", id]);
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
          that.http.get(environment.host + 'user', dataTablesParameters).subscribe((res: any) => {
            if (res.success) callback({ data: res.data });
            else callback({ data: [] });
          }, (err: any) => {
            that.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
            callback({ data: [] });
          });
        },
        columns: [
          {
            title: 'Name',
            data: 'name',
            render: function (data: any, type: any, full: any) {
              return `
                    <div class="d-inline-block align-middle">
                        <img src="assets/images/user/default-user-icon.png" alt="user image"
                            class="img-radius align-top m-r-15" style="width:40px;">
                        <div class="d-inline-block">
                            <h6 class="m-b-0">${full.name}</h6>
                            <p class="m-b-0">${full.email}</p>
                        </div>
                    </div>`
            }
          },
          {
            title: 'Role',
            data: 'role'
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
            title: 'Status',
            data: 'active',
            render: function (data: any, type: any, full: any) {
              return data ? `<span class="badge badge-light-success">Active</span>` : `<span class="badge badge-light-danger">Inactive</span>`
            }
          },
          {
            title: 'Actions',
            render: function (data: any, type: any, full: any) {
                return `
                  <button edit_tag="${full.id}" class="btn btn-icon-2 btn-success" title="Edit User">
                  <i class="feather icon-edit" edit_tag="${full.id}"></i>
                  </button>
                  <button delete_tag="${full.id}" class="btn btn-icon-2 btn-danger" title="Delete User">
                  <i class="feather icon-trash-2" delete_tag="${full.id}"></i>
                  </button>`
            }
        }
        ],
        dom: `Bftrip`,
        buttons: [
          { extend: 'colvis', text: '<i class="feather icon-eye-off"></i>&nbsp;Columns', className: 'btn btn-secondary', visible: 0 },
          { extend: 'copy', text: '<i class="feather icon-copy"></i>&nbsp;Copy', className: 'btn btn-primary', visible: false },
          { extend: 'print', text: '<i class="feather icon-printer"></i>&nbsp;Print', className: 'btn btn-primary', visible: false },
          { extend: 'excel', text: '<i class="feather icon-file-text"></i>&nbsp;Export to Excel', className: 'btn btn-primary' },
          { extend: 'csv', text: '<i class="feather icon-file-text"></i>&nbsp;Export to CSV', className: 'btn btn-primary' },
          { extend: 'selectAll', text: '<i class="feather icon-align-justify"></i>&nbsp;Select All', className: 'btn btn-primary' },
          { extend: 'selectNone', text: '<i class="feather icon-x"></i>&nbsp;Select None', className: 'btn btn-primary' },
          {
            text: '<i class="feather icon-trash-2"></i>&nbsp;Bulk Delete',
            className: 'btn btn-danger',
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
        this.http.post(environment.host + 'user/bulkDelete', { data }).subscribe((res: any) => {
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
        this.http.delete(environment.host + 'user/' + id).subscribe((res: any) => {
          if (res.success === true) {
            this.reload();
            this.toastr.addToast({ title: 'Success', msg: res.message, type: 'success' });
          } else {
            this.toastr.addToast({ title: 'Error', msg: 'Attribute cannot be deleted', type: 'error' });
          }
        },
          (err: any) => {
            this.toastr.addToast({ title: 'Error', msg: err.message, type: 'error' });
          });
      }
    });
  }

}