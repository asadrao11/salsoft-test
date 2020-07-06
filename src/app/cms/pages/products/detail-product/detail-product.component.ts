import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { ToasterService } from 'src/app/cms/services/toaster.service';

@Component({
  selector: "app-detail-product",
  templateUrl: "./detail-product.component.html",
  styleUrls: ["./detail-product.component.scss"],
})
export class DetailProductComponent implements OnInit {

  public dataLoaded = false;
  public productData: any;
  public unitData: any;
  public jointAttributes = [];
  public imagesAssigned = [];
  public productID;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private toastr: ToasterService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.getProductByID();
  }

  async getProductByID() {
    this.productID = this.route.snapshot.paramMap.get("id");
    this.dataLoaded = false;
    this.unitData = [];
    this.jointAttributes = [];
    this.http
      .get(environment.host + "product/CompleteDetail/" + this.productID)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.productData = res.data;
          this.imagesAssigned = res.data.assignedImages ? res.data.assignedImages : [];
          await this.productData.attributes.forEach(async (item: any) => {
            if (item.type === "Multi-Select-DropDown") {

              let values = item.pivot.value ? item.pivot.value.split(",") : [];
              let details = [];
              for (const val of values) {
                this.http
                  .get(environment.host + "attributeValue/" + val)
                  .subscribe(async (res: any) => {
                    if (res.success) details.push(res.data);
                  });
              }

              let x = false;
              item.units.forEach((u: any) => {
                if (item.pivot.attribute_unit_id === u.id) {  
                  this.unitData.push(u.short_code);
                  x = true;
                }
              });
              if (x === false) this.unitData.push("");
              item.details = details;
            } else {
              let x = false;
              item.units.forEach((u: any) => {
                if (item.pivot.attribute_unit_id === u.id) {
                  this.unitData.push(u.short_code);
                  x = true;
                }
              });
              if (x === false) this.unitData.push("");
            }
          });

          this.jointAttributes = res.data.joint_attributes;
          this.dataLoaded = true;
        } else {
          Swal.fire({
            title: 'Error',
            text: `This is product is not fully saved. (${res.error})`,
            type: 'error',
            showCloseButton: true,
          }).then(() => {
            this.dataLoaded = true;
            this.router.navigate(["/public/view-product"]);
          });
        }
      });
  }
}