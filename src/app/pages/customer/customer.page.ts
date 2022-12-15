import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  qrData: string = " " ;

  constructor(private supabaseService:SupabaseService) { }

  ngOnInit() {

    this.supabaseService.getUser().then((response)=> this.qrData=response!);
  }

}
