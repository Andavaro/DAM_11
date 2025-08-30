import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DispositivosService } from '../services/dispositivos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class HistorialPage implements OnInit {
  dispositivoId!: number;
  mediciones: any[] = [];

  constructor(private route: ActivatedRoute, private dispositivosService: DispositivosService) {}

  ngOnInit() {
    this.dispositivoId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.dispositivosService.getMediciones(this.dispositivoId).subscribe((data) => {
      this.mediciones = data;
    });
  }
}
