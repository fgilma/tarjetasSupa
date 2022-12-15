import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login-terminal',
  templateUrl: './login-terminal.page.html',
  styleUrls: ['./login-terminal.page.scss'],
})
export class LoginTerminalPage implements OnInit {
  credentialsTerminal!: FormGroup;
  terminal:any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private supabaseService:SupabaseService) { }

  ngOnInit() {
    this.credentialsTerminal = this.fb.group({
      terminal: ['', Validators.required],    
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginTerminal(){
    if (this.credentialsTerminal.valid){
      //console.log('terminal correcto');
      this.supabaseService.loginTerminal(this.credentialsTerminal.value.terminal,
                                         this.credentialsTerminal.value.password)
                                         .then((response)=> {                                          
                                            console.log(response);
                                            this.terminal = response;
                                            this.router.navigate(['/list', this.terminal.company_id_fk, this.terminal.name_terminal]);
                                         
                                      
                                        })
                                        .catch((error)=>console.log(error.message));
      //console.log(this.credentialsTerminal.value.terminal);
      
      this.credentialsTerminal.reset();
    }
  }

}
