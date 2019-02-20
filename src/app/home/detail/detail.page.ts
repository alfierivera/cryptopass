import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Web3Service } from 'src/app/services/web3.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: string;
  account;
  constructor(
    private route: ActivatedRoute,
    private _w3: Web3Service,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadAccount();
  }

  async loadAccount() {
    if (await this._w3.isConnected()) {
      this.account = await this._w3.getAccount(this.id);
    } else {
      this.loadAccount();
    }
  }

  async copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    const toast = await this.toastCtrl.create({
      message: 'Copied to clipboard!',
      duration: 2500,
      position: 'middle'
    });
    await toast.present();
  }

}
