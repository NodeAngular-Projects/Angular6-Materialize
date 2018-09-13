import { OrderCategoriesComponent } from './order-page/order-categories/order-categories.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { EmptyLayoutComponent } from './shared/layouts/empty-layout/empty-layout.component';
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { CategoriesFormComponent } from './categories-page/categories-form/categories-form.component';

import { AuthGuard } from './shared/classes/auth.guard';
import { OrderPositionsComponent } from './order-page/order-positions/order-positions.component';

const routes: Routes = [
  { 
    path: '', component: EmptyLayoutComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegistrationPageComponent }
    ]
  },
  { 
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewPageComponent },
      { path: 'analytics', component: AnalyticsPageComponent },
      { path: 'history', component: HistoryPageComponent },
      { path: 'order', component: OrderPageComponent, children: [
        { path: '', component: OrderCategoriesComponent },
        { path: ':id', component: OrderPositionsComponent }
      ] },
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'categories/new', component: CategoriesFormComponent },
      { path: 'categories/:id', component: CategoriesFormComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}