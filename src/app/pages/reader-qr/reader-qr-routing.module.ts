import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderQRPage } from './reader-qr.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderQRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderQRPageRoutingModule {}
