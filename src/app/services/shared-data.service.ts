import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private dataStore: {
//pages communes
    register?: any;
    userType?: string;
//jobseekr pages
    personal?: any;
    profile?: any;
    social?: any;
    account?: any;
//recruiter pages
    company?: any;
    founding?: any;
    sociall?: any;
    contact?: any;
  } = {};

  private debugMode = true;

  setData(key: 'register' | 'userType' | 'personal' | 'profile' | 'social' | 'account'|  'company' | 'founding' | 'sociall' | 'contact', value: any): void {
    this.dataStore[key] = value;
    if (this.debugMode) {
      console.log(`[SharedData] ${key} updated:`, value);
    }
  }

  getData(key: 'register' | 'userType' | 'personal' | 'profile' | 'social' | 'account'| 'company' | 'founding' | 'sociall' | 'contact'): any {
    const value = this.dataStore[key];
    if (this.debugMode) {
      console.log(`[SharedData] ${key} retrieved:`, value);
    }
    return value;
  }

  getAllData(): any {
    const allData = {
      ...this.dataStore.register,
      userType: this.dataStore.userType,
      ...this.dataStore.personal,
      ...this.dataStore.profile,
      ...this.dataStore.social,
      ...this.dataStore.account,
      ...this.dataStore.company,
      ...this.dataStore.founding,
      ...this.dataStore.sociall,
      ...this.dataStore.contact
    };

    if (this.debugMode) {
      console.log('[SharedData] All combined data:', allData);
    }

    return allData;
  }

  clearAll(): void {
    this.dataStore = {};
    if (this.debugMode) {
      console.log('[SharedData] All data cleared');
    }
  }
}