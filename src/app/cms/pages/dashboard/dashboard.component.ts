import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { ApexChartService } from '../../../theme/shared/components/chart/apex-chart/apex-chart.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    dashboardData: any;
    currentDate = new Date();

    // categoriesChartConfig = {
    //     chart: {
    //         height: 300,
    //         type: 'pie',
    //     },
    //     series: [],
    //     labels: [],
    //     legend: {
    //         show: true,
    //     },
    //     dataLabels: {
    //         enabled: true,
    //         dropShadow: {
    //             enabled: false,
    //         }
    //     },
    //     responsive: [{
    //         breakpoint: 700,
    //         options: {
    //             legend: {
    //                 position: 'bottom',
    //             }
    //         }
    //     }]
    // };
    // brandsChartConfig = {
    //     chart: {
    //         height: 300,
    //         type: 'donut',
    //     },
    //     theme: {
    //         mode: 'light',
    //         palette: 'palette6',
    //         monochrome: {
    //             enabled: false,
    //             color: '#255aee',
    //             shadeTo: 'light',
    //             shadeIntensity: 0.65
    //         },
    //     },
    //     series: [],
    //     labels: [],
    //     legend: {
    //         show: true,
    //     },
    //     dataLabels: {
    //         enabled: true,
    //         dropShadow: {
    //             enabled: false,
    //         }
    //     },
    //     responsive: [{
    //         breakpoint: 700,
    //         options: {
    //             legend: {
    //                 position: 'bottom',
    //             }
    //         }
    //     }]
    // };
    templateChartData = {
        chart: {
            type: 'area',
            height: 90,
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#FFF'],
        fill: {
            type: 'solid',
            opacity: 1
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        series: [{
            name: 'series1',
            data: [65, 45, 60, 40, 80]
        }],
        yaxis: {
            min: 0,
            max: 80,
        },
        tooltip: {
            theme: 'dark',
            fixed: {
                enabled: false
            },
            x: {
                show: false,
            },
            y: {
                show: false,
            },
            marker: {
                show: false
            }
        }
    };

    constructor(
        private http: HttpClient,
        private toaster: ToasterService,
        public apexEvent: ApexChartService
    ) { }

    ngOnInit() {
        this.getDashboardData();
    }

    async getDashboardData() {
        try {
            this.http.get(environment.host + 'dashboard/statistics').subscribe((res: any) => {
                if (res.success) {
                    this.dashboardData = res.data;
                    if (res.data.category_stats) {
                        // this.categoriesChartConfig.series = res.data.category_stats.map(a => a.count);
                        // this.categoriesChartConfig.labels = res.data.category_stats.map(a => a.name);
                    }
                    if (res.data.brand_stats) {
                        // this.brandsChartConfig.series = res.data.brand_stats.map(a => a.count);
                        // this.brandsChartConfig.labels = res.data.brand_stats.map(a => a.name);
                    }

                } else {
                    this.toaster.addToast({ title: 'Error', msg: res.message, type: 'error' });
                }
            }, (err: any) => {
                this.toaster.addToast({ title: 'Error', msg: err.message, type: 'error' });
                Swal.fire({
                    title: 'Error',
                    text: `An error is occured while loading dashboard data. (${err.message})`,
                    type: 'error',
                    showCloseButton: true,
                    showCancelButton: true
                }).then((willDelete) => {
                    if (!willDelete.dismiss) {
                        location.reload();
                    }
                });
            });
        } catch (e) {
            this.toaster.addToast({ title: 'Error', msg: e.message, type: 'error' });
            Swal.fire({
                title: 'Error',
                text: `An error is occured while loading dashboard data. (${e.message})`,
                type: 'error',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (!willDelete.dismiss) {
                    location.reload();
                }
            });
        }
    }
}
