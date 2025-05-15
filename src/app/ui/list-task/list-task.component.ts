import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../infraestructure/services/task/task.service';
import { Task } from '../models/task'; 
import { FormsModule } from '@angular/forms';
import { TaskModalComponent } from '../features/basic/modal/modal.component';
import { HeaderComponent } from '../features/header/header.component';
import { CategoryService } from '../infraestructure/services/category/category.service';
import { Option } from '../models/option';
import { Category } from '../models/category';
import { 
  IonSelect, 
  IonButton, 
  IonHeader, 
  IonLabel, 
  IonTitle, 
  IonSelectOption, 
  IonCheckbox, 
  IonItem,
  IonContent,
  IonList,
  IonToolbar,
  LoadingController,
  ModalController,
  IonIcon
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-list-task',
  standalone: true,
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  imports: [
    IonSelect,
    IonButton,
    IonHeader, 
    IonLabel,
    IonTitle,
    CommonModule,
    FormsModule, 
    HeaderComponent,
    IonSelectOption,
    IonCheckbox,
    IonItem,
    IonContent,
    IonList,
    IonToolbar,
    IonIcon
  ],
})
export class ListTaskComponent  implements OnInit {

  constructor(
    public taskService: TaskService,
    private modalController : ModalController,
    private loadingController: LoadingController,
    private categoryService: CategoryService
  ){
    addIcons({ trash });
  }


  //Variables
  tasksList: Task[] = [];
  private loading: HTMLIonLoadingElement | null = null;
  paginatedTasks: Task[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  optionsCategory: Category[] = [];
  selectedId: string = '';
  dynamicClassTask: string = 'left-vignette selected';
  dynamicClassCategory: string = 'left-vignette';

  // Methods
  async ngOnInit() {
      await this.getTasks('start');
      this.optionsCategory = await this.categoryService.getCategories();
      console.log('get categories');
      this.updatePaginatedTasks();
  }
  async ionViewWillEnter() {
    this.optionsCategory = await this.categoryService.getCategories();
  }
  async createTask(task : Task) {

    try {
      this.showLoading();
      await this.taskService.addTask(task);
      await this.getTasks('start');
      this.updatePaginatedTasks();
    } catch (error) {
      console.log(error);
    } finally {
      this.hideLoading();
    }
  }

  async deleteTask(id : string | null  | undefined) : Promise<void>  {

    try {
      this.showLoading();
      const idData = id ?? '';
      console.log('id a borrar: ', idData);
      
      await this.taskService.deleteTask(idData);
  
      this.tasksList = this.tasksList.filter(task => task.id !== id);
      this.updatePaginatedTasks();
    } catch (error) {
      console.log(error);
    } finally {
      this.hideLoading();
    }

  }

  async getTasks(direction: 'start' | 'next' | 'previous') {
    try {
      this.showLoading();   
      this.tasksList = await this.taskService.getTasks(direction);
    } catch (error) {
      console.error('Error getting tasks:', error);
    } finally {
      this.hideLoading();
    }
  }

  async deleteTaskModal(id : string | null | undefined) : Promise<void> {
    const modal = await this.modalController.create({
      component: TaskModalComponent,
      componentProps: {
        title: 'Borrar Tarea',
        descripcion: 'Seguro que desar borrar tarea?',
        approveButtonName: 'Si',
        insert: false,
        valueInput : id,
        cssClass: 'my-modal-class'
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.value) {
      await this.deleteTask(data.value);
    }
  }

  async saveTaskModal() {
    const modal = await this.modalController.create({
      component: TaskModalComponent,
      componentProps: {
        title: 'Agregar Tarea',
        descripcion: 'Adiciona una tarea',
        approveButtonName: 'Guardar',
        insert: true,
        descripcionSelect: 'Selecciona una categoria',
        options: this.optionsCategory.map(option =>({ key : option.id, value: option.name})) as Option[],
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.value && data?.valueSelect) {
      const category = this.optionsCategory.find(category => category.id == data.valueSelect);
      const newTask : Task = {isExec:false, description: data.value, active: true, category:category};
      this.createTask(newTask);
    }
  }

  async updateTaskExec(id : string | null | undefined, isCheck: boolean) : Promise<void> {
    try {
      this.showLoading();   
      const task = this.tasksList.find(task => task.id == id);
      if (task) {
        task.isExec = isCheck;
        await this.taskService.updateTask(task);
      }   
    } catch (error) {
      console.log(error);
    } finally {
      this.hideLoading();
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

  updatePaginatedTasks() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTasks = this.tasksList.slice(start, end);
  }

  async nextPage() {
      await this.getTasks('next');
      this.updatePaginatedTasks();
  }

  async prevPage() {
      await this.getTasks('previous');
      this.updatePaginatedTasks();
  }

  async filterCategory(event : any ) {
    const idCategory = event.detail.value;
    console.log('idcategory', event.detail.value);
    await this.getTasks('start');

    this.tasksList = this.tasksList.filter(task => !idCategory 
      || task.category?.id == idCategory);
      this.updatePaginatedTasks();
  }

  async clearFilterCategory() {
    this.selectedId = '';
    await this.getTasks('start');
    this.updatePaginatedTasks();
  }
}
