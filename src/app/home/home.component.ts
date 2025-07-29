import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule,RouterModule], // Ajoutez TranslateModule ici
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentLanguage = 'English';
  showLanguageDropdown = false;
  categories = [
    { name: 'Financial Services', icon: 'finance.webp' },
    { name: 'Development', icon: 'developement.jpg' },
    { name: 'Graphic Design', icon: 'GD.webp' },
    { name: 'Hotels & Tourism', icon: 'hotel.webp' },
    { name: 'Commerce', icon: 'commerce.jpeg' },
    { name: 'Education', icon: 'education.jpg' },
    { name: 'Transport', icon: 'transport.png' },
    { name: 'More+', icon: 'more.jpg' }
  ];

  constructor(private translate: TranslateService) {
    // Définir la langue par défaut
    translate.setDefaultLang('en');
    translate.use('en');
  }

  toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.showLanguageDropdown = false;
    
    if (lang === 'Français') {
      this.translate.use('fr');
    } else {
      this.translate.use('en');
    }
  }

  scrollTo(id: string) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
}