import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// The modal's component of the previous chapter
import { AddComponent } from './add.component';

@NgModule({
     declarations: [
       AddComponent
     ],
     imports: [
       IonicModule,
       CommonModule,
       ReactiveFormsModule,
       FormsModule
     ],
     entryComponents: [
       AddComponent
     ]
})
export class AddComponentModule {}