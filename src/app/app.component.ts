import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GLOBAL } from './core/namespace/globals.namespace';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  GLOBAL = GLOBAL;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    GLOBAL.MOBILE = window.innerWidth < 768;
  }
}
