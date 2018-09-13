import { ElementRef } from '@angular/core/core';
import { MaterialInstance } from './MaterialInstance';
import { MaterialDatepicker } from './../models/MaterialDatepicker';

declare var M;

export class MaterialService {
  static toast(message: string, colorClass: string) {
    M.toast({ html: message, classes: colorClass, outDuration: 150 });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatepicker(
    ref: ElementRef,
    onClose: () => void
  ): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose: onClose
    });
  }

  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  }
}
