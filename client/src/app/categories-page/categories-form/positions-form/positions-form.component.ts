import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Position } from '../../../shared/models/Position';
import { MaterialInstance } from '../../../shared/classes/MaterialInstance';
import { MaterialService } from '../../../shared/classes/material.service';
import { PositionService } from '../../../shared/services/position.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  positionId = null;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Delete position "${position.name}"?`);

    if (decision) {
      this.positionService.delete(position)
        .subscribe(
          response => {
            const ind = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(ind, 1);
            MaterialService.toast(response.message, 'green');
          },
          err => MaterialService.toast(err.error.message, 'red')
        );
    }
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition)
      .subscribe(position => {
        const ind = this.positions.findIndex(p => p._id === position._id);
        this.positions[ind] = position;
        MaterialService.toast('Position updated!', 'green');
      },
      err => MaterialService.toast(err.error.message, 'red'),
      completed);
    } else {
      this.positionService.create(newPosition)
      .subscribe(position => {
        MaterialService.toast('Position created!', 'green');
        this.positions.push(position);
      },
      err => MaterialService.toast(err.error.message, 'red'),
      completed);
    }
  }


}
