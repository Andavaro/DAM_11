// src/app/services/random.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  // devuelve un número entre 10 y 90 para simular % humedad (puedes ajustar)
  generarHumedad(): number {
    const min = 10;
    const max = 90;
    return Math.round(Math.random() * (max - min) + min);
  }
}
