import { MaterialDatepicker } from './../../shared/models/MaterialDatepicker';
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Filter } from './../../shared/models/Filter';
import { MaterialService } from './../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @Output()
  outFilter = new EventEmitter<Filter>();
  @ViewChild('start')
  startRef: ElementRef;
  @ViewChild('end')
  endRef: ElementRef;

  start: MaterialDatepicker;
  end: MaterialDatepicker;
  serial: number;

  isValid = true;

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }
  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(
      this.startRef,
      this.validate.bind(this)
    );
    this.end = MaterialService.initDatepicker(
      this.endRef,
      this.validate.bind(this)
    );
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.serial) {
      filter.serial = this.serial;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.outFilter.emit(filter);
  }
}
