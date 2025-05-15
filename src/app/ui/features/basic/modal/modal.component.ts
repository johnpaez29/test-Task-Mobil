import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Option } from 'src/app/models/option';
import { 
  ModalController,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonButtons,
  IonItem,
  IonToolbar,
  IonLabel,
  IonContent,
  IonTitle,
  IonInput
} from '@ionic/angular/standalone'
@Component({
  selector: 'app-task-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonButtons,
    IonItem,
    IonToolbar,
    IonLabel,
    IonContent,
    IonTitle,
    IonInput
  ], 
})
export class TaskModalComponent {

  title: string = '';
  descripcion: string = '';
  descripcionSelect : string = '';
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