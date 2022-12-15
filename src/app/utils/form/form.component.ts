import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  credentials!: FormGroup;
  @Input() option!:string;

  constructor(private fb: FormBuilder,
              private supabaseService:SupabaseService,
              private route:Router) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  login(){
    console.log(this.credentials.value);
    if (this.option == "Register"){
      this.supabaseService.signup(this.credentials.value.email, this.credentials.value.password)
                          .then((response)=> {console.log('respuesta registro', response);
                                             })
                          .catch((error)=>console.log('error registro', error.message));
    }
    else{
      
      this.supabaseService.signInWithEmail(this.credentials.value.email, this.credentials.value.password)
                          .then((response)=> {console.log('respuesta login', response);
                                              this.route.navigateByUrl('/home', { replaceUrl: true });})
                          .catch((error)=>console.log('error login', error.message));                         
      
  }

}
}
