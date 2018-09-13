import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { MaterialInstance } from './../../shared/classes/MaterialInstance';
import { Order } from './../../shared/models/Order';
import { MaterialService } from './../../shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input()
  orders: Order[];
  @ViewChild('modal')
  modalRef: ElementRef;

  selectedOrder: Order;
  modal: MaterialInstance;

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return (total += item.quantity * item.cost);
    }, 0);
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }
}
