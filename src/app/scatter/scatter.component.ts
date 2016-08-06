import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'my-scatter',
  template: `<ng-content></ng-content>`
})
export class ScatterComponent implements OnInit, OnChanges {
  private outerWidth: number = 300;
  private outerHeight: number = 250;
  private margin = { left: 45, top: 10, right: 15, bottom: 40 };
  private circleRadius: number = 5;
  private rMin: number = 1;
  private rMax: number = 15;
  private xColumn: string = "sepal_length";
  private yColumn: string = "petal_length";
  private rColumn: string = "sepal_width";
  private cColumn: string = "species";
  private cScheme: string[] = d3.schemeCategory10;
  private styleAttrs = {"stroke-width": "2px","fill": "none"};
  private xAxisLabelText: string = "Sepal Length";
  private xAxisLabelOffset: number = 35;
  private yAxisLabelText: string = "Petal Length";
  private yAxisLabelOffset: number = 30;
  
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

  constructor(private element: ElementRef) { 
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement);
  }

  ngOnInit() { 
    this.setup();
    this.render();
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(`changes ${JSON.stringify(changes)}`);
    this.render();
  }

  render(){
    this.scaleX.domain(d3.extent(this.data, d => d[this.xColumn]));
    this.scaleY.domain(d3.extent(this.data, d => d[this.yColumn]));
    this.scaleR.domain(d3.extent(this.data, d => d[this.rColumn]));

    this.yAxisG.call(this.yAxis);
    this.xAxisG.call(this.xAxis);

    //bind data to dom with a selector
    console.log(`this.data ${JSON.stringify(this.data)}`);
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
    this.scaleX = d3.scaleLinear().range([0, this.innerWidth]);
    this.scaleY = d3.scaleLinear().range([this.innerHeight, 0]);
    this.scaleR = d3.scaleLinear().range([this.rMin, this.rMax]);
    this.scaleC = d3.scaleOrdinal().range(this.cScheme);

    this.yAxis = d3.axisLeft(this.scaleY);
    this.xAxis = d3.axisBottom(this.scaleX);
  }
  
}