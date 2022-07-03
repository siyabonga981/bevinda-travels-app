import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { }
  getAgent(){
    return JSON.parse(localStorage.getItem(('agent')));
  }

  setAgent(agent){
    return localStorage.setItem('agent', JSON.stringify(agent));
  }
}
