import { Action } from '@ngrx/store';
import { Iris } from './iris.model';

export const irisesReducer = (irises: Array<Iris> = [], action: Action) => {
  switch(action.type){
    case "ADD_IRIS":
      return [...irises, irisReducer(null, action)]
    default:
      return irises;
  }
}

const irisReducer = (iris: Iris = null, action: Action) => {
  switch(action.type){
    case "ADD_IRIS":
      return Object.assign({}, action.payload, {dirty: true});
    default:
      return iris;
  }
}