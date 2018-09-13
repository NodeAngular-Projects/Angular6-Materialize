import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from './../shared/models/Category';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch();
  }

}
