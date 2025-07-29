import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedDataService {
  private userData: any = {
    register: {},    // Données d'inscription
    personal: {},    // Données personnelles
    profile: {},     // Données du profil
    social: {},      // Réseaux sociaux
    account: {}      // Paramètres du compte
  };

  setRegisterData(data: any) {
    this.userData.register = data;
  }

  setPersonalData(data: any) {
    this.userData.personal = data;
  }

  setProfileData(data: any) {
    this.userData.profile = data;
  }

  setSocialData(data: any) {
    this.userData.social = data;
  }

  setAccountData(data: any) {
    this.userData.account = data;
  }

  getUserData() {
    return {
      ...this.userData.register,
      ...this.userData.personal,
      ...this.userData.profile,
      ...this.userData.social,
      ...this.userData.account
    };
  }
}