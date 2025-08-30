export interface Medicion {
  medicionId?: number;
  fecha: string; // ISO datetime
  valor: string | number; // % humedad (string porque en DB está varchar)
  dispositivoId: number;
}
