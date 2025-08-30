// src/app/services/dispositivos.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dispositivo } from '../models/dispositivo';
import { Medicion } from '../models/medicion';
import { LogRiego } from '../models/log-riego';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root'
})
export class DispositivosService {
  constructor(private api: ApiService, private random: RandomService) {}

  // GET /dispositivos
  getDispositivos(): Observable<Dispositivo[]> {
    return this.api.get<Dispositivo[]>('/dispositivos');
  }

  // GET /dispositivos/:id  (detalle)
  getDispositivo(id: number): Observable<Dispositivo> {
    return this.api.get<Dispositivo>(`/dispositivos/${id}`);
  }

  // GET /dispositivos/:id/mediciones  -> lista completa
  getMediciones(id: number): Observable<Medicion[]> {
    return this.api.get<Medicion[]>(`/dispositivos/${id}/mediciones`);
  }

  // Preferible usar el endpoint del mock: /mediciones/ultima
  getUltimaMedicion(id: number): Observable<Medicion | null> {
    // Intentamos la ruta específica (más eficiente). Si falla, fallback a obtener lista y elegir último.
    return this.api.get<Medicion>(`/dispositivos/${id}/mediciones/ultima`);
    // Si tu backend NO tiene /ultima, usa la alternativa comentada:
    /*
    return this.getMediciones(id).pipe(
      map(list => {
        if (!list || list.length === 0) return null;
        return list.reduce((prev, cur) => (new Date(prev.fecha) > new Date(cur.fecha) ? prev : cur));
      })
    );
    */
  }

  // GET estado de la válvula asociado al dispositivo (mock tiene /estado)
  getEstadoValvula(id: number): Observable<{ apertura: number; fecha: string } | null> {
    return this.api.get<any>(`/dispositivos/${id}/estado`);
  }

  /**
   * Accionar válvula
   *
   * Firma flexible y compatible con el mock-server:
   * - id: id del dispositivo
   * - accion: 'abrir' | 'cerrar' (opcional)
   * - electrovalvulaId: opcional (si lo tienes)
   * - valor: opcional valor de humedad (si quieres forzar)
   *
   * Retorna Observable<any> con la respuesta del mock: { message, log, medicion, estado }
   */
  accionarValvula(
    id: number,
    accion?: 'abrir' | 'cerrar',
    electrovalvulaId?: number,
    valor?: number
  ): Observable<any> {
    const body: any = {};
    if (accion) body.accion = accion;
    if (typeof electrovalvulaId !== 'undefined') body.electrovalvulaId = electrovalvulaId;
    if (typeof valor !== 'undefined') body.valor = valor;
    // Si no envías valor, el mock genera uno aleatorio
    return this.api.post<any>(`/dispositivos/${id}/accionar`, body);
  }
}
