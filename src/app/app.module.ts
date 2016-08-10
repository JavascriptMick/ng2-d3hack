import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ScatterComponent } from './scatter/scatter.component';

@NgModule({
    declarations: [AppComponent, ScatterComponent],
    imports:      [BrowserModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}