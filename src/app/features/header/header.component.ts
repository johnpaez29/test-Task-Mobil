import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class HeaderComponent  implements OnInit {

  constructor(private router : Router) { }

  //Variables
  @Input() 
  dynamicClassTask: string = 'left-vignette';
  @Input() 
  dynamicClassCategory: string = 'left-vignette';

  ngOnInit() {}

  navToTasks() {
    this.router.navigate(['/list-task']);
  }

  
  navToCategories() {
    this.router.navigate(['/list-category']);
  }
}
