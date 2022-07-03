import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dashboardCards: any = [
    {
      icon: 'groups',
      title: 'All Tasks',
      figure: '190',
      backgroundColor: 'blue-background'
    },
    {
      icon: 'work',
      title: 'My Tasks',
      figure: '40',
      backgroundColor: 'green-background'
    },
    {
      icon: 'badge',
      title: 'Users',
      figure: '65',
      backgroundColor: 'red-background'
    },
    {
      icon: 'email',
      title: 'Enquiries',
      figure: '29',
      backgroundColor: 'purple-background'
    }
  ];

  public doughnutChartLabels: Label[] = ['All Tasks', 'My Tasks', 'Unassigned Tasks'];
  public doughnutChartData: MultiDataSet = [
    [190, 40, 60]
  ];
  public doughnutChartType: ChartType = 'doughnut';
  constructor() { }

  ngOnInit(): void {
  }

}
