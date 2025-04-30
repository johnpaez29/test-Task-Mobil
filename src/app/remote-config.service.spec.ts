import { inject, Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getString } from 'firebase/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remoteConfig = inject(RemoteConfig);

  async initConfig(): Promise<void> {
    await fetchAndActivate(this.remoteConfig);
  }

  getValue(key: string): string {
    return getString(this.remoteConfig, key);
  }
}