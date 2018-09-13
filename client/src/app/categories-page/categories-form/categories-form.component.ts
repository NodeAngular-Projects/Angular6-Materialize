import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Category } from './../../shared/models/Category';
import { CategoryService } from '../../shared/services/category.service';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  image: File;
  imagePreview: any;
  isNew = true;
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;

              return this.categoryService.getById(params['id']);
            }

            return of(null);
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }

          this.form.enable();
        },
        error => MaterialService.toast(error.error.message, 'red')
      );
  }

  triggerUpload() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoryService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Successfully saved!', 'green');
        this.form.enable();
      },
      err => {
        MaterialService.toast(err.error.message, 'red');
        this.form.enable();
      }
    );
  }

  deleteCategory() {
    const decision = window.confirm(`Are you sure you want to delete the category ${this.category.name}?`);

    if (decision) {
      this.categoryService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message, 'green'),
          err => MaterialService.toast(err.error.message, 'red'),
          () => this.router.navigate(['/categories'])
        );
    }
  }

}
