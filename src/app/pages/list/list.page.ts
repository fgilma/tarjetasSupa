import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  
  campania!: any[];  
  id!: number;
  nameCompany!:any;
  campania_filtrados!: any[];
  terminal!:string;
 


  constructor(private route: ActivatedRoute, 
              private supabaseService:SupabaseService, 
              public alertCtrl: AlertController, 
              private router: Router) { }

  ngOnInit() {
    
      this.id = +this.route.snapshot.params['id'];   
      this.terminal = this.route.snapshot.params['terminal']; 
      this.supabaseService.getCampaign(this.id, 'company_id_fk')
                          .then((response)=>{this.campania =response!;
                                             console.log(this.campania);
                                             this.campania_filtrados = this.campania;
                                            });

      this.supabaseService.getCompany(this.id)
                          .then((response) => {this.nameCompany= response;
                                                console.log(response)});        
                 
        }   

// Filtrado lista
handleChange(event:any) {
  const query = event.target.value.toLowerCase();
  this.campania_filtrados = this.campania.filter(d => d.name_campaign!.toLowerCase().indexOf(query) > -1);
}

// Muestra cada campaña
async showCampaign(currentName: any, index:any) {  
  
  let alert = await this.alertCtrl.create({   
    header: 'Campaña',
    subHeader: currentName.name_campaign,
    message: currentName.name_card_campaign,
    inputs: [
      {
        name: "points",
        placeholder: 'Puntos'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Confirm',
        handler: data => {          
          this.router.navigate(['/reader-qr', currentName.company_id_fk, currentName.id_campaign, data.points, this.terminal]);
        }
      }
    ]
  });
  await alert.present();
};
}
