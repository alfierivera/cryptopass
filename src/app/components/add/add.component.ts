import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  private numbers = false;
  private length = 10;
  private symbols = false;
  private uppercase = true;
  private excludeSimilarCharacters = false;
  private exclude = '';

  public Form: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder
    ) {
    this.Form = formBuilder.group({
      name: ['', Validators.required],
      handle: ['', Validators.required],
      numbers: [this.numbers],
      length: [this.length],
      symbols: [this.symbols],
      uppercase: [this.uppercase],
      excludeSimilarCharacters: [this.excludeSimilarCharacters],
      exclude: [this.exclude],
    });
  }

  async dismiss(exit?: boolean) {
    if (exit) {
      await this.modalCtrl.dismiss(false);
    } else {
      const result = {
        options: {
          numbers: this.Form.value.numbers,
          length: this.Form.value.length,
          symbols: this.Form.value.symbols,
          uppercase: this.Form.value.uppercase,
          excludeSimilarCharacters: this.Form.value.excludeSimilarCharacters,
          exclude: this.Form.value.exclude
        },
        data: {
          name: this.Form.value.name,
          handle: this.Form.value.handle
        }
      };
      await this.modalCtrl.dismiss(result);
    }
  }
}
