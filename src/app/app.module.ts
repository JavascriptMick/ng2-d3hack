import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { D3Service } from 'd3-ng2-service';
import { AppComponent }   from './app.component';
import { ScatterComponent } from './scatter/scatter.component';

@NgModule({
    declarations: [AppComponent, ScatterComponent],
    imports:      [BrowserModule],
    providers:    [D3Service],
    bootstrap:    [AppComponent],
})
export class AppModule {}