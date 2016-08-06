import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'my-scatter',
  template: `<ng-content></ng-content><p>scatter here</p>`
})
export class ScatterComponent implements OnInit {
  constructor() { }

  ngOnInit() { console.log(d3);}

}