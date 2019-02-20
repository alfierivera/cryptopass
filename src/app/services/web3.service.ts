import {Injectable} from '@angular/core';
import { Account } from '../interfaces/account';
import * as uuid from 'uuid/v4';
import * as Crypto from 'crypto-js';
import * as pw from 'generate-password';
const CryptoPass_Artifacts = require('./contracts/CryptoPass.json');
const Web3 = require('web3');


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private prefix = 'CP';
  private web3: any;
  private accounts: string[];
  public ready = false;
  CryptoPass: any;
  public address = '0x2B96AF5654D76879A5ed840B9F9cd4aea6499c5D';

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
      this.CryptoPass = this.web3.eth.Contract(CryptoPass_Artifacts.abi, this.address, {
        gasPrice: 1
      });
    });
  }

  private get(key: string): any {
    try {
      const store = localStorage.getItem(`${this.prefix}-${key}`);
      return JSON.parse(store);
    } catch (error) {
      return false;
    }
  }

  private set(key: string, content: any): boolean {
    try {
      localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(content));
      return true;
    } catch (error) {
      return false;
    }
  }

  private encrypt(content: string): string {
    return Crypto.AES.encrypt(content, this.getMaster()).toString();
  }

  public decrypt(cypher: string): string {
    return Crypto.AES.decrypt(cypher, this.getMaster()).toString(Crypto.enc.Utf8);
  }

  public setMaster(secret: string): boolean {
    try {
      this.set('pk', secret);
      return true;
    } catch (error) {
      return false;
    }
  }

  public getMaster() {
    try {
      return this.get('pk');
    } catch (error) {
      return false;
    }
  }

  public generatePassword(options: any): string {
    return pw.generate(options);
  }

  public decryptAccounts(accounts: any): [Account] {
    try {
      return accounts.map(account => {
        const time = account.created * 1000;
        account.password = this.decrypt(account.password);
        account.handle = this.decrypt(account.handle);
        account.name = this.decrypt(account.name);
        account.created = new Date(time);
        return account;
      });
    } catch (error) {
      return error;
    }
  }

  public prepare(account: Account, options: any): Account {
    try {
      const time = new Date().getTime();
      const id = uuid();
      const created = Math.round(time / 1000);
      const password = this.generatePassword(options);
      account.id = id;
      account.created = created;
      account.password = this.encrypt(password);
      account.handle = this.encrypt(account.handle);
      account.name = this.encrypt(account.name);
      return account;
    } catch (error) {
      return error;
    }
  }

  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
  }

  public async getAccounts() {
    const publicKey = await this.getPublicKey();
    const length = await this.CryptoPass.methods.getAccountLength().call({from: publicKey.address});
    const accounts = [];
    for (let i = 0; i < length.count; i++) {
      const call = this.CryptoPass.methods.Accounts(publicKey.address, i).call({from: publicKey.address});
      accounts.push(call);
    }
    return this.decryptAccounts(await Promise.all(accounts));
  }

  public async getAccount(id: string) {
    const accounts = await this.getAccounts();
    return accounts.find(acc => acc.id === id);
  }

  public async createAccount(account: Account, options: any) {
    const record = this.prepare(account, options);
    const publicKey = await this.getPublicKey();
    return await this.CryptoPass.methods.createAccount(
      record.id, record.name, record.handle, record.password, record.created
    ).send({from: publicKey.address, gas: 30000000});
  }

  public isConnected() {
    return new Promise((done) => {
      setTimeout(() => {
        if (this.web3) {
          this.web3.eth.net.isListening().then(done);
        } else {
          done(false);
        }
      }, 500);
    });
  }

  private async getPublicKey() {
    return await this.web3.eth.accounts.privateKeyToAccount(this.getMaster());
  }
}
