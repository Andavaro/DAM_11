// src/app/home/home.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { DispositivosService } from '../services/dispositivos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  dispositivos: any[] = [];

  constructor(
    private dispositivosService: DispositivosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    this.dispositivosService.getDispositivos().subscribe({
      next: (data) => {
        this.dispositivos = data ?? [];
        loading.dismiss();
      },
      error: (err) => {
        console.error(err);
        loading.dismiss();
        this.presentToast('Error cargando dispositivos');
      }
    });
  }

  verDispositivo(id: number) {
    this.router.navigate(['/dispositivo', id]); // o '/device' si así lo tienes
  }

  private async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1500 });
    await t.present();
  }
}
