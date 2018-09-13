import { Injectable } from '@angular/core';
import { Position } from './../shared/models/Position';
import { OrderItem } from './../shared/models/OrderItem';

@Injectable()
export class OrderModalService {

  public list: OrderItem[] = [];
  public total = 0;

  add(position: Position) {
    const orderItem: OrderItem = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(p => p._id === orderItem._id);
    if (candidate) {
      candidate.quantity += orderItem.quantity;
    } else {
      this.list.push(orderItem);
    }

    this.computeTotal();
  }

  remove(orderItem: OrderItem) {
    const ind = this.list.findIndex(p => p._id === orderItem._id);
    this.list.splice(ind, 1);

    this.computeTotal();
  }

  clear() {
    this.list = [];
    this.total = 0;
  }

  private computeTotal() {
    this.total = this.list.reduce((totalPrice, item) => {
      return totalPrice += item.quantity * item.cost;
    }, 0);
  }
}
