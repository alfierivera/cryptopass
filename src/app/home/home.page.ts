import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddComponent } from '../components/add/add.component';
import { Router } from '@angular/router';
import { Web3Service } from '../services/web3.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public accounts;
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private _w3: Web3Service,
    private router: Router
  ) {
    if (!this._w3.getMaster()) {
      this.promptForPk();
    }
  }

  async promptForPk() {
    const alert = await this.alertCtrl.create({
      header: 'Add your account',
      inputs: [
        {
          name: 'pk',
          type: 'text',
          placeholder: 'Private Key'
        }
      ],
      buttons: [ {
          text: 'Save',
          handler: (data) => {
            this._w3.setMaster('0x' + data.pk);
            this.loadAccounts();
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    document.title = 'CryptoPass';
    this.loadAccounts();
  }

  async loadAccounts() {
    if (await this._w3.isConnected() && this._w3.getMaster()) {
      this.accounts = await this._w3.getAccounts();
    } else {
      this.loadAccounts();
    }
  }

  detail(id: string) {
    this.router.navigateByUrl(`/accounts/${id}`);
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: AddComponent
    });
    await modal.present();

    const result: any = await modal.onDidDismiss();
    if (result.data !== false) {
      const account = await this._w3.createAccount(result.data.data, result.data.options);
      this.loadAccounts();
    }
  }
}
