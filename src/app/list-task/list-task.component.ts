import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import {IonButton, IonTitle, IonLabel, IonItem, IonList, IonContent,IonCheckbox} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task'; 
import { FormsModule } from '@angular/forms';
import { TaskModalComponent } from '../features/basic/modal/modal.component';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  imports: [IonicModule,CommonModule,FormsModule],
})
export class ListTaskComponent  implements OnInit {

  constructor(
    private router: Router,
    private taskService: TaskService,
    private modalController : ModalController,
    private loadingController: LoadingController
  ){}
  tasksList: Task[] = [];
  private loading: HTMLIonLoadingElement | null = null;
  ngOnInit() {
      this.getTasks();
  }

  async createTask(task : Task) {

    try {
      this.showLoading();
      await this.taskService.addTask(task);
      await this.getTasks();  
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
    } catch (error) {
      console.log(error);
    } finally {
      this.hideLoading();
    }

  }

  async getTasks() {
    try {
      this.showLoading();   
      this.tasksList = await this.taskService.getTasks();
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
        valueInput : id
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      await this.deleteTask(data);
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
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      const newTask : Task = {isExec:false, descripcion: data, active: true};
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
    console.log('loading2');

  }
}
