import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges,  } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';

@Component({
  //moduleId: module.id.toString(),//required untill this is fixed (https://github.com/angular/angular/issues/10626)
  selector: 'my-scatter',
  template: `<ng-content></ng-content>`
})
export class ScatterComponent implements OnInit, OnChanges {
  private d3: D3;

  @Input() outerWidth: number = 300;
  @Input() outerHeight: number = 250;
  @Input() margin = { left: 45, top: 10, right: 15, bottom: 40 };
  @Input() xAxisLabelOffset: number = 35;
  @Input() yAxisLabelOffset: number = 30;
  @Input() rMin: number = 1;
  @Input() rMax: number = 15;
  @Input() styleAttrs = {"stroke-width": "2px","fill": "none"};
  @Input() cScheme: string[] = [];
  @Input() rColumn: string = "";
  @Input() cColumn: string = "";
  @Input() xColumn: string = "";
  @Input() yColumn: string = "";
  @Input() xAxisLabelText: string = "";
  @Input() yAxisLabelText: string = "";
  

  private htmlElement: HTMLElement;
  private host;
  private svg; private g; private xAxisG; private xAxisLabel;
  private yAxisG; private yAxisLabel; 
  private scaleX; private scaleY; private scaleR; private scaleC;
  private yAxis; private xAxis;
  private innerWidth: number;
  private innerHeight: number;

  private data = [
    {sepal_length: 1.3,sepal_width: 3.5,petal_length: 1.4,petal_width: 0.2,species: "setosa"},
    {sepal_length: 2.1,sepal_width: 3.5,petal_length: 7.6,petal_width: 0.2,species: "stuff"},
    {sepal_length: 7.1,sepal_width: 3.5,petal_length: 2.3,petal_width: 0.2,species: "setosa"},
    {sepal_length: 9.9,sepal_width: 3.0,petal_length: 11.6,petal_width: 0.2,species: "thing"}
  ];

  constructor(private element: ElementRef, d3Service: D3Service) { 
    this.htmlElement = this.element.nativeElement;
    this.d3 = d3Service.getD3();
    this.host = this.d3.select(this.element.nativeElement);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    //we want to set up the svg AND render the chart when any component properties like width or max/min radius change.  only the render() should be called on DATA changes
    this.setup();
    this.render();
  }

  render(){
    this.scaleX.domain(this.d3.extent(this.data, d => d[this.xColumn]));
    this.scaleY.domain(this.d3.extent(this.data, d => d[this.yColumn]));
    this.scaleR.domain(this.d3.extent(this.data, d => d[this.rColumn]));

    this.yAxisG.call(this.yAxis);
    this.xAxisG.call(this.xAxis);

    //bind data to dom with a selector
    var circles = this.g.selectAll("circle").data(this.data);

    var circlesEnter = circles.enter().append("circle");

    //use styleAttrs to set enter properties
    for (var key in this.styleAttrs) {
      if (this.styleAttrs.hasOwnProperty(key)) {
        var element = this.styleAttrs[key];
        circlesEnter.attr(key, element)
      }
    }

    //set dynamic properties
    var circlesUpdate = circlesEnter.merge(circles)
      .attr("cx", d => this.scaleX(d[this.xColumn]))
      .attr("cy", d => this.scaleY(d[this.yColumn]))
      .attr("r", d => this.scaleR(d[this.rColumn]));

    if(!this.styleAttrs.hasOwnProperty("stroke")){
      circlesUpdate.attr("stroke", d => this.scaleC(d[this.cColumn]));
    }

    if(!this.styleAttrs.hasOwnProperty("fill")){
      circlesUpdate.attr("fill", d => this.scaleC(d[this.cColumn]));
    }
  }

  setup(){
    if(this.cScheme.length===0){
      this.cScheme = this.d3.schemeCategory10;
    }

    this.innerWidth  = this.outerWidth  - this.margin.left - this.margin.right;
    this.innerHeight = this.outerHeight - this.margin.top  - this.margin.bottom;

    this.svg = this.host.append("svg")
      .attr("width", this.outerWidth)
      .attr("height", this.outerHeight);

    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.xAxisG = this.g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.innerHeight + ")");
    this.xAxisLabel = this.xAxisG.append("text")
      .attr("font-size", "12pt")
      .style("text-anchor", "middle")
      .style("font-family", 'Times New Roman, Georgia, Serif')
      .style('fill','black')
      .attr("x", this.innerWidth / 2)
      .attr("y", this.xAxisLabelOffset)
      .text(this.xAxisLabelText);

    this.yAxisG = this.g.append("g")
      .attr("class", "y axis");

    this.yAxisLabel = this.yAxisG.append("text")
      .attr("font-size", "12pt")
      .style("text-anchor", "middle")
      .style("font-family", 'Times New Roman, Georgia, Serif')
      .style('fill','black')
      .attr("transform", "translate(-" + this.yAxisLabelOffset + "," + (this.innerHeight / 2) + ") rotate(-90)")
      .text(this.yAxisLabelText);  
    
    this.scaleX = this.d3.scaleLinear().range([0, this.innerWidth]);
    this.scaleY = this.d3.scaleLinear().range([this.innerHeight, 0]);
    this.scaleR = this.d3.scaleLinear().range([this.rMin, this.rMax]);
    this.scaleC = this.d3.scaleOrdinal().range(this.cScheme);

    this.yAxis = this.d3.axisLeft(this.scaleY);
    this.xAxis = this.d3.axisBottom(this.scaleX);
  }
  
}