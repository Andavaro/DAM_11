// src/app/dispositivo/dispositivo.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DispositivosService } from '../services/dispositivos.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})
export class DispositivoPage implements OnInit {
  dispositivoId!: number;
  dispositivo: any = null;
  ultimaMedicion: any = null;
  estadoValvula: boolean | null = null; // true = abierta, false = cerrada, null = desconocido
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private dispositivosService: DispositivosService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.dispositivoId = idParam ? Number(idParam) : NaN;
    if (isNaN(this.dispositivoId)) {
      this.presentToast('ID de dispositivo inválido');
      return;
    }

    await this.loadAll();
  }

  private async presentLoading(text = 'Cargando...') {
    this.loading = await this.loadingCtrl.create({ message: text });
    await this.loading.present();
  }

  private async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  private async loadAll() {
    try {
      await this.presentLoading();
      // detalle del dispositivo
      this.dispositivosService.getDispositivo(this.dispositivoId).subscribe({
        next: (d) => (this.dispositivo = d),
        error: (err) => {
          console.error(err);
          this.presentToast('Error cargando dispositivo');
        }
      });

      // última medición
      this.dispositivosService.getUltimaMedicion(this.dispositivoId).subscribe({
        next: (m) => (this.ultimaMedicion = m),
        error: (err) => {
          console.error(err);
          this.presentToast('Error cargando última medición');
        }
      });

      // estado de la válvula (opcional pero recomendable)
      this.dispositivosService.getEstadoValvula(this.dispositivoId).subscribe({
        next: (s) => {
          // s = { apertura: 1|0, fecha: ... } según mock
          if (s && typeof s.apertura !== 'undefined') this.estadoValvula = Boolean(Number(s.apertura));
          else this.estadoValvula = null;
        },
        error: (err) => {
          console.warn('No se pudo obtener estado de válvula', err);
          this.estadoValvula = null;
        }
      });
    } finally {
      await this.dismissLoading();
    }
  }

  // Alterna el estado (si conocemos estado actual lo invertimos, si no, pedimos toggle por defecto)
  accionValvula() {
    const abrir = this.estadoValvula === null ? true : !this.estadoValvula;
    const accion = abrir ? 'abrir' : 'cerrar';

    // Si tu servicio requiere electrovalvulaId puedes pasarlo (lo tomamos del dispositivo)
    const electrovalvulaId = this.dispositivo?.electrovalvulaId ?? null;

    this.dispositivosService.accionarValvula(this.dispositivoId, accion, electrovalvulaId).subscribe({
      next: (res: any) => {
        // el mock responde con { log, medicion, estado }
        this.estadoValvula = Boolean(Number(res?.estado?.apertura ?? (abrir ? 1 : 0)));
        this.ultimaMedicion = res?.medicion ?? this.ultimaMedicion;
        this.presentToast('Acción registrada correctamente');
      },
      error: (err) => {
        console.error(err);
        this.presentToast('Error al accionar la válvula');
      }
    });
  }

  irHistorial() {
    // si usas routerLink en plantilla, esto no es necesario; lo dejo por si lo quieres desde TS
  }

  private async presentToast(message: string, duration = 1500) {
    const t = await this.toastCtrl.create({ message, duration });
    await t.present();
  }
}
