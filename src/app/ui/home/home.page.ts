import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RemoteConfigService } from '../../infraestructure/services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar,
     IonTitle, 
     IonContent,
     IonButton
    ],
})
export class HomePage {
  constructor(private router : Router, 
    private configService : RemoteConfigService
  ) {}

  public message: string = '';
  // Methods
  async ngOnInit() {
    await this.configService.initConfig();
    console.log(this.configService);
    this.message = this.configService.getValue('messageInit') || 'Default welcome!';
}

  navigateToListNotes() {
    this.router.navigate(['/list-task']);
  }
}
