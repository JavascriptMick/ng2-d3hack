import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { provideStore } from '@ngrx/store';
import { irisesReducer } from './app/iris/iris.reducer';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule,[
  provideStore({irisesReducer}, {iris:[]})
]);