import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
        // private fb: FormBuilder,
        //       private supabaseService:SupabaseService
              ) { }

  // email:string = '';
  // credentials!: FormGroup;

  ngOnInit() {
    // this.credentials = this.fb.group({
    //   name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(6)]]
    // });
  }

  // async handleLogin(event: any) {
  //   event.preventDefault()
  //   const loader = await this.supabaseService.createLoader()
  //   await loader.present()
  //   try {
  //     await this.supabaseService.signIn(this.credentials.value)
  //     await loader.dismiss()
  //     await this.supabaseService.createNotice('Check your email for the login link!')
  //   } catch (error:any) {
  //     await loader.dismiss()
  //     await this.supabaseService.createNotice(error.error_description || error.message)
  //   }
  // }
}
