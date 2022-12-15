import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginTerminalPage } from './login-terminal.page';

const routes: Routes = [
  {
    path: '',
    component: LoginTerminalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginTerminalPageRoutingModule {}
