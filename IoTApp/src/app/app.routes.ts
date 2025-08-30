// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'dispositivo/:id', loadComponent: () => import('./device/device.page').then(m => m.DevicePage) },
  { path: 'historial/:id', loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage) },
];
