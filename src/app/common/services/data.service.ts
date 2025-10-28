import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HostListener } from '@angular/core';

@Injectable()
export class DataService {

  private dataSource = new BehaviorSubject('');
  currentData = this.dataSource.asObservable();
  constructor() { }

  transferData(data: string) {
    this.dataSource.next(data)
  }

  setItemInStorage(data: any, storageName) {
    localStorage.setItem(storageName, JSON.stringify(data));
  }

  getItemFromStorage(storageName) {
    let data = localStorage.getItem(storageName);
    return JSON.parse(data);
  }

  removeItemFromStorage(storageName) {
    localStorage.removeItem(storageName);
  }

  cleanAll() {
    localStorage.clear()
  }
}