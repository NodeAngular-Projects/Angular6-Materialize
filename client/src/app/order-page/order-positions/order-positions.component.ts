import { MaterialService } from './../../shared/classes/material.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { OrderModalService } from '../order-modal.service';
import { PositionService } from './../../shared/services/position.service';
import { Position } from './../../shared/models/Position';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionService: PositionService,
    private order: OrderModalService) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.positionService.fetch(params['id']);
        }),
        map((positions: Position[]) => {
          return positions.map(p => {
            p.quantity = 1;
            return p;
          });
        })
      );
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Added ${position.name}*${position.quantity}`, 'green');
    this.order.add(position);
  }
}
