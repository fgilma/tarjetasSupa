import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReaderQRPageRoutingModule } from './reader-qr-routing.module';

import { ReaderQRPage } from './reader-qr.page';
import { ToolbarModule } from 'src/app/utils/toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReaderQRPageRoutingModule,
    ToolbarModule
  ],
  declarations: [ReaderQRPage]
})
export class ReaderQRPageModule {}
