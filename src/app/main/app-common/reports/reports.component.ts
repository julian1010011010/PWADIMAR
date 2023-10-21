import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppCommonService } from '../../../services/app-common/app-common.service';
import { SurveyComponent } from '../survey/survey.component';
import { locale as spanish } from './i18n/es';
import * as Highcharts from 'highcharts';
import { some } from 'lodash'

@Component({
  selector: 'report-control',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild(SurveyComponent) surveyComponent;
  @ViewChild('dataTable') table;

  @Input() tittleReport: string;
  @Input() reportId: string = null;
  @Input() reportType: string = null;
  reports = [];
  report: any;
  resultReport: boolean = false;
  json: any = {};
  selected: any;
  rows = [];
  tableColumns = [];
  dataTable: any;
  dataTableInstance: any;
  dtOptions: any;
  emptyTable: string;
  search: string;
  previous: string;
  next: string;
  first: string;
  last: string;
  submitText: string;
  title: string;

  selectedChartTypes: string;
  selectedColumn: number;
  charttypes = [];
  columns = [];
  Highcharts: Highcharts.Chart = null;
  counts: any = {};

  constructor(
    private appCommonService: AppCommonService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish);

    this.loadTranslations();
  }

  ngOnInit(): void {
    this.loadChartTypes();

    if(this.reportId !== null && this.reportId !== ''){
      this.loadReport();
    }
    else{
      if(this.reportType !== null && this.reportType !== ''){
        this.loadReportsByModule();
      }
    }
  }

  loadReportsByModule(): void {
    this.appCommonService.GetReportsByModule(this.reportType)
      .subscribe(data => {
        this.reports = data;
      },
        error => {
          console.error('ReportsComponent.GetReportsByModule', error);
        }
      );
  }

  loadReport(): void {

    this.appCommonService.GetReport(this.reportId)
      .subscribe(data => {
        
        if(data.parameters === undefined || data.parameters === null || data.parameters === '')
        {
          data.parameters = '{"logoPosition":"none","pages":[{"name":"page1","elements":[{"type":"panel","name":"panel2","elements":[{"type":"expression","name":"question1","titleLocation":"hidden","hideNumber":true}]},{"type":"panel","name":"panel1","startWithNewLine":false}]}],"showCompletedPage":false,"showQuestionNumbers":"off"}';
        }
        
        this.json = JSON.parse(data.parameters);
        this.surveyComponent.loadSurvey(this.json);
        
        var element = document.getElementById(this.reportId);
        element.style.cssText = 'width: 100%; height: 0px;';
        
        this.rows = [];
        this.tableColumns = JSON.parse(data.columnsDefinition);
        this.initDatatables();

        this.title = data.title || null;
        if(!some(this.reports, {name: this.reportId, title: this.title}))
        {
          this.reports.push({name: this.reportId, title: this.title});
        }

        this.columns = [];
        for (var column in this.tableColumns) {
          this.columns.push({ id: column, description: this.tableColumns[column].title });
        }

      },
        error => {
          console.error('ReportsComponent.GetReport', error);
        }
      );
  }

  async loadTranslations(): Promise<void> {
    this.emptyTable = await this._fuseTranslationLoaderService.getTranslation('REPORT.EMPTYTABLE');
    this.search = await this._fuseTranslationLoaderService.getTranslation('REPORT.SEARCH');
    this.previous = await this._fuseTranslationLoaderService.getTranslation('REPORT.PREVIOUS');
    this.next = await this._fuseTranslationLoaderService.getTranslation('REPORT.NEXT');
    this.first = await this._fuseTranslationLoaderService.getTranslation('REPORT.FIRST');
    this.last = await this._fuseTranslationLoaderService.getTranslation('REPORT.LAST');
    this.submitText = await this._fuseTranslationLoaderService.getTranslation('REPORT.SUBMIT');
  }

  initDatatables() {
    this.dataTable = $(this.table.nativeElement);

    if(this.dataTableInstance !== undefined && this.dataTableInstance !== null){
      this.dataTable.DataTable().clear().draw();
      this.dataTable.DataTable().clear().destroy();
      this.dataTable.empty();
    }

    this.dtOptions = {
      "data": this.rows,
      "columns": this.tableColumns,
      "paging": true,
      "ordering": true,
      "info": true,
      "pagingType": "full_numbers",
      "pageLength": 7,
      "processing": false,
      "destroy": true,
      "scrollX": true,
      "language": {
        "emptyTable": this.emptyTable,
        "zeroRecords": this.emptyTable,
        "infoEmpty": this.emptyTable,
        "search": this.search,
        "info": "_PAGE_ de _PAGES_",
        "paginate": {
          "previous": this.previous,
          "next": this.next,
          "first": this.first,
          "last": this.last,
        }
      },
      "dom": 'Bfrtip',
      "buttons": [
        'copy', 'csv', 'excel', 'print', 'pdf'
      ]
    };

    this.dataTableInstance = this.dataTable.DataTable(this.dtOptions);
  }

  generateReport(reportData=null) {
    let result;
    const data = {
        name: this.reportId,
        inTokens: reportData
    };
    this.appCommonService.ExecuteReport(data)
      .subscribe(data => result = data,
        error => {
          console.error('ReportsComponent.ExecuteReport', error);
        },
        () => {
          this.resultReport = true;
          this.rows = result;
          this.dataTableInstance.clear().draw();
          this.dataTableInstance.rows.add(this.rows).draw();
          this.selectedChartTypes = '';
          this.selectedColumn = -1;
          this.updateChart();
        });
  }

  loadChartTypes() {
    this.charttypes.push({ id: "line", description: "Linear" });
    this.charttypes.push({ id: "pie", description: "Torta" });
    this.charttypes.push({ id: "column", description: "Barras" });
    this.charttypes.push({ id: "bar", description: "Barras Laterales" });
  }

  updateChart() {

    if (this.selectedChartTypes !== undefined &&
      this.selectedChartTypes !== null &&
      this.selectedColumn !== undefined &&
      this.selectedColumn !== null) {

      if (this.Highcharts !== null) {
        this.Highcharts.destroy();
        var element = document.getElementById("chart-container");
        element.style.cssText = 'height: 0px;';
      }

      if (this.selectedChartTypes !== '') {
        var element = document.getElementById("chart-container");
        element.style.cssText = 'height: 400px; min-width: 380px;';
        let chartOptions = this.GetHighchartsOptions(this.selectedChartTypes);
        this.Highcharts = Highcharts.chart(chartOptions);
      }
    }
  }

  GetHighchartsOptions(selectedChartTypes): Highcharts.Options {

    let chartOptions: Highcharts.Options = {};

    let dataForChart = this.chartData();

    let labels = Object.keys(this.counts);

    if (selectedChartTypes === 'pie') {
      chartOptions = {
        chart: {
          renderTo: 'chart-container',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1,
          inverted: false,
          plotBackgroundColor: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: ' '
        },
        tooltip: {
          pointFormat: '<b>{point.y}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}'
            }
          }
        },
        series: [{
          name: ' ',
          colorByPoint: true,
          data: dataForChart,
          type: selectedChartTypes
        }]
      };
    }
    else {
      chartOptions = {
        chart: {
          renderTo: 'chart-container',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1,
          inverted: false,
          plotBackgroundColor: null,
          plotShadow: false,
          type: selectedChartTypes
        },
        title: {
          text: ' '
        },
        xAxis: {
          categories: labels,
          title: {
            text: null
          }
        },
        yAxis: {
          title: {
            text: 'Valores'
          }
        },
        tooltip: {
          pointFormat: '<b>{point.y}</b>'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          shadow: true
        },
        series: [{
          name: ' ',
          colorByPoint: true,
          data: dataForChart,
          type: selectedChartTypes
        }]
      };
    }

    return chartOptions;
  }

  chartData() {
    var counts = {};
    this.dataTableInstance
      .column(this.selectedColumn, { search: 'applied' })
      .data()
      .each(function (val) {
        if (counts[val]) {
          counts[val] += 1;
        } else {
          counts[val] = 1;
        }
      });

    this.counts = counts;

    // And map it to the format highcharts uses
    return $.map(this.counts, function (val, key) {
      return {
        name: key,
        y: val,
      };
    });
  }
}