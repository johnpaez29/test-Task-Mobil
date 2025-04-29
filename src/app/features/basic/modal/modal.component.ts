import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Option } from 'src/app/models/option';

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
  options: Option[] = [];
  selectedId: string = '';
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  saveModal() {

    if (this.options.length > 0 && !this.selectedId) {
        return;
    }

    if (this.insert && !this.valueInput) {
        return;
    }
    this.modalController.dismiss({value:this.valueInput,valueSelect:this.selectedId});
  }
}