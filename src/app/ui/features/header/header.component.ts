import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RemoteConfigService } from 'src/app/infraestructure/services/remote-config.service';
import {
  IonLabel,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ 
    IonLabel, 
    IonToolbar,
    IonHeader,
    CommonModule
  ]
})
export class HeaderComponent  implements OnInit {


  constructor(private router : Router,
    private remoteConfig : RemoteConfigService
  ) { }

  //Variables
  @Input() 
  dynamicClassTask: string = 'left-vignette';
  @Input() 
  dynamicClassCategory: string = 'left-vignette';

  protected hideCategoryModule : boolean = false;  
  ngOnInit() {
    this.hideCategoryModule = this.remoteConfig.getValue('hideCategoryModule') == 'true';
  }

  navToTasks() {
    this.router.navigate(['/list-task']);
  }

  
  navToCategories() {
    this.router.navigate(['/list-category']);
  }
}
