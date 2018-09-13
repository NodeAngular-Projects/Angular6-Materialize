import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderModalService } from './order-modal.service';
import { MaterialService } from './../shared/classes/material.service';
import { MaterialInstance } from '../shared/classes/MaterialInstance';
import { Order } from '../shared/models/Order';
import { OrderItem } from '../shared/models/OrderItem';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderModalService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  oSub: Subscription;
  modal: MaterialInstance;
  pending = false;

  constructor(
    private router: Router,
    private order: OrderModalService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  removeItem(orderItem: OrderItem) {
    this.order.remove(orderItem);
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.orderService.create(order)
      .subscribe(
        newOrder => {
          MaterialService.toast(`Order #${newOrder.serial} added.`, 'green');
          this.order.clear();
        },
        err => MaterialService.toast(err.error.message, 'red'),
        () => {
          this.modal.close();
          this.pending = false;
        }
      );
  }
}
