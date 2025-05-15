import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'list-task',
    loadComponent: () => import('./list-task/list-task.component').then((m) => m.ListTaskComponent),
  },
  {
    path: 'list-category',
    loadComponent: () => import('./list-category/list-category.component').then((m) => m.ListCategoryComponent),
  },
];
