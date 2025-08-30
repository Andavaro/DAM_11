// src/app/device/device.page.ts (standalone component)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DispositivosService } from '../services/dispositivos.service';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {
  dispositivoId!: number;
  ultimaMedicion: any = null;
  dispositivo: any = null;
  // true = abierta, false = cerrada, null = desconocido
  estadoValvula: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private dispSvc: DispositivosService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.dispositivoId = idParam ? Number(idParam) : NaN;
    if (isNaN(this.dispositivoId)) {
      // LLAMADA ACTUALIZADA: Usamos el tipo 'danger' para errores
      this.presentToast('ID de dispositivo inválido', 'danger');
      return;
    }
    this.loadData();
  }

  loadData() {
    // detalle del dispositivo
    this.dispSvc.getDispositivo(this.dispositivoId).subscribe({
      next: d => {
        this.dispositivo = d;
      },
      error: err => {
        console.error('Error al obtener dispositivo', err);
        // LLAMADA ACTUALIZADA: Usamos el tipo 'danger' para errores
        this.presentToast('Error al cargar el dispositivo', 'danger');
      }
    });

    // última medición
    this.dispSvc.getUltimaMedicion(this.dispositivoId).subscribe({
      next: m => (this.ultimaMedicion = m ?? null),
      error: err => {
        console.error('Error al obtener última medición', err);
        this.ultimaMedicion = null;
      }
    });

    // estado de la válvula
    this.dispSvc.getEstadoValvula(this.dispositivoId).subscribe({
      next: s => {
        if (s && typeof s.apertura !== 'undefined') this.estadoValvula = Boolean(Number(s.apertura));
        else this.estadoValvula = null;
      },
      error: err => {
        console.warn('No se obtuvo estado de válvula', err);
        this.estadoValvula = null;
      }
    });
  }

  toggleValvula() {
    const abrir = this.estadoValvula === null ? true : !this.estadoValvula;
    const accion = abrir ? 'abrir' : 'cerrar';
    const electrovalvulaId = this.dispositivo?.electrovalvulaId;

    this.dispSvc.accionarValvula(this.dispositivoId, accion as 'abrir' | 'cerrar', electrovalvulaId).subscribe({
      next: (res: any) => {
        this.estadoValvula = Boolean(Number(res?.estado?.apertura ?? (abrir ? 1 : 0)));
        this.ultimaMedicion = res?.medicion ?? this.ultimaMedicion;

        // LLAMADA ACTUALIZADA: Mensaje y tipo 'success' para acciones correctas
        const successMessage = abrir ? 'Válvula abierta con éxito' : 'Válvula cerrada con éxito';
        this.presentToast(successMessage, 'success');
      },
      error: err => {
        console.error('Error al accionar válvula', err);
        // LLAMADA ACTUALIZADA: Usamos el tipo 'danger' para errores
        this.presentToast('Error al accionar la válvula', 'danger');
      }
    });
  }

  /**
   * Muestra un toast con un diseño mejorado.
   * @param msg El mensaje a mostrar.
   * @param type El tipo de toast: 'success', 'warning', 'danger', o 'info' (por defecto).
   * @param dur La duración en milisegundos.
   */
  private async presentToast(
    msg: string,
    type: 'success' | 'warning' | 'danger' | 'info' = 'info',
    dur = 2500
  ) {
    let iconName: string;
    let colorName: string;

    switch (type) {
      case 'success':
        iconName = 'checkmark-circle-outline';
        colorName = 'success';
        break;
      case 'warning':
        iconName = 'warning-outline';
        colorName = 'warning';
        break;
      case 'danger':
        iconName = 'close-circle-outline';
        colorName = 'danger';
        break;
      default:
        iconName = 'information-circle-outline';
        colorName = 'primary';
        break;
    }

    const t = await this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: 'top',
      icon: iconName,
      color: colorName,
      cssClass: 'custom-toast',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await t.present();
  }
}
