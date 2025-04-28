import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, IonicModule,FormsModule], 
})
export class TaskModalComponent {

  title: string = '';
  descripcion: string = '';
  insert: boolean = false;
  approveButtonName: string = '';
  valueInput: string = '';

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  saveTask() {
    this.modalController.dismiss(this.valueInput);
  }
}