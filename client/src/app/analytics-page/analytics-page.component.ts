import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from './../shared/models/AnalyticsPage';
import { AnalyticsService } from './../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain')
  gainRef: ElementRef;
  @ViewChild('order')
  orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.analyticsService
      .getAnalytics()
      .subscribe((data: AnalyticsPage) => {
        this.average = data.average;

        gainConfig.labels = data.chart.map(item => item.label);
        gainConfig.data = data.chart.map(item => item.gain);

        orderConfig.labels = data.chart.map(item => item.label);
        orderConfig.data = data.chart.map(item => item.order);

        const gainContext = this.gainRef.nativeElement.getContext('2d');
        gainContext.canvas.height = '300px';

        const orderContext = this.orderRef.nativeElement.getContext('2d');
        orderContext.canvas.height = '300px';

        // tslint:disable-next-line:no-unused-expression
        new Chart(gainContext, createChartConfig(gainConfig));
        // tslint:disable-next-line:no-unused-expression
        new Chart(orderContext, createChartConfig(orderConfig));

        this.pending = false;
      });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };
}
