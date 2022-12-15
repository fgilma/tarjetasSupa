import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  constructor(private supabaseService:SupabaseService,
              private route:Router) { }

  ngOnInit() {}

  logout(){
    this.supabaseService.signOut().then(()=> this.route.navigate(['/signup']));

  }

}
