import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category'; 
import { TaskModalComponent } from '../features/basic/modal/modal.component';
import { HeaderComponent } from '../features/header/header.component';
import { 
  ModalController, 
  LoadingController,
  IonButton,
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
  imports: [ 
    CommonModule, 
    HeaderComponent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonIcon
  ]
})
export class ListCategoryComponent  implements OnInit {

   constructor(
      private categoryService: CategoryService,
      private modalController : ModalController,
      private loadingController: LoadingController
    ){
      addIcons({ trash });
    }

  //Variables
    categoryList: Category[] = [];
    private loading: HTMLIonLoadingElement | null = null;
    paginatedCategories: Category[] = [];
    currentPage: number = 1;
    pageSize: number = 5;
    dynamicClassTask: string = 'left-vignette selected';
    dynamicClassCategory: string = 'left-vignette';

    // Methods
    async ngOnInit() {
        await this.getCategories();
        this.updatePaginatedCategories();
    }
  
    async createCategory(category : Category) {
  
      try {
        this.showLoading();
        await this.categoryService.addCategory(category);
        await this.getCategories();
        this.updatePaginatedCategories();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    }
  
    async deleteCategory(id : string | null  | undefined) : Promise<void>  {
  
      try {
        this.showLoading();
        const idData = id ?? '';
        console.log('id a borrar: ', idData);
        await this.categoryService.deleteCategory(idData);
    
        this.categoryList = this.categoryList.filter(category => category.id !== id);
        this.updatePaginatedCategories();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
  
    }
  
    async getCategories() {
      try {
        this.showLoading();   
        this.categoryList = await this.categoryService.getCategories();
      } catch (error) {
        console.error('Error getting categories:', error);
      } finally {
        this.hideLoading();
      }
    }
  
    async deleteCategoryModal(id : string | null | undefined) : Promise<void> {
      const modal = await this.modalController.create({
        component: TaskModalComponent,
        componentProps: {
          title: 'Borrar Categoria',
          descripcion: 'Seguro que desar borrar categoria?',
          approveButtonName: 'Si',
          insert: false,
          valueInput : id,
          cssClass: 'my-modal-class'
        }
      });
  
      await modal.present();
  
      const { data } = await modal.onDidDismiss();
      if (data?.value) {
        await this.deleteCategory(data.value);
      }
    }
  
    async saveCategoryModal() {
      const modal = await this.modalController.create({
        component: TaskModalComponent,
        componentProps: {
          title: 'Agregar Categoria',
          descripcion: 'Adiciona una categoria',
          approveButtonName: 'Guardar',
          insert: true,
        }
      });
  
      await modal.present();
  
      const { data } = await modal.onDidDismiss();
      if (data?.value) {
        const newCategory : Category = {name: data?.value, active: true};
        this.createCategory(newCategory);
      }
    }
  
    async showLoading(message: string = 'Por favor espere...') {
      if (!this.loading) {
        this.loading = await this.loadingController.create({
          message: message,
          spinner: 'circles',
        });
        await this.loading.present();
      }
    }
  
    async hideLoading() {
      if (this.loading) {
        console.log('loading');
        await this.loading.dismiss();
        this.loading = null;
      }
    }
  
    updatePaginatedCategories() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedCategories = this.categoryList.slice(start, end);
    }
  
    nextPage() {
      if ((this.currentPage * this.pageSize) < this.categoryList.length) {
        this.currentPage++;
        this.updatePaginatedCategories();
      }
    }
  
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedCategories();
      }
    }

}
