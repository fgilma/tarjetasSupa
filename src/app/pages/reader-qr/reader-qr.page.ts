import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-reader-qr',
  templateUrl: './reader-qr.page.html',
  styleUrls: ['./reader-qr.page.scss'],
})
export class ReaderQRPage implements OnInit {
  scanActive: boolean = false;  
  user:any;
  idCustomer!: string;
  mobileweb: boolean = false;
  campaign!: number;
  company!: number;
  points!: number;
  campaignCard: any;
  terminal!:number;

  constructor(public platform: Platform, private router:Router,
              private supabaseService: SupabaseService,
              public alertController: AlertController,
              private route: ActivatedRoute,) { }

  ngOnInit():void {
    this.campaign = this.route.snapshot.params['campaign']; 
    this.company = this.route.snapshot.params['company']; 
    this.points = this.route.snapshot.params['points'];
    this.terminal = this.route.snapshot.params ['terminal'];
    
    console.log('es la plataforma hibrida: ',this.platform.is('hybrid'));
    console.log('es la plataforma desktop: ',this.platform.is('desktop'));
    console.log('es la plataforma mobileweb: ', this.platform.is('mobileweb'));
   
    if (this.platform.is('mobileweb') || this.platform.is('desktop')){
      this.mobileweb=true;
    } else{
      this.mobileweb=false;
    }     
   }
 
   async checkPermission() {
     return new Promise(async (resolve, reject) => {
       const status = await BarcodeScanner.checkPermission({ force: true });
       if (status.granted) {
         resolve(true);
       } else if (status.denied) {
         BarcodeScanner.openAppSettings();
         resolve(false);
       }
     });
   }
 
   async startScanner() {
     const allowed = await this.checkPermission(); 
     if (allowed) {
       this.scanActive = true;
      BarcodeScanner.hideBackground();
      document.querySelector('body')!.classList.add('scanner-active');
 
       const result = await BarcodeScanner.startScan();
 
       if (result.hasContent) {
         this.scanActive = false;
         alert(result.content);
         //alert(result.content); //The QR content will come out here
         //Handle the data as your heart desires here
         //this.idCustomer = result.content!;
         this.sumaPuntos(result.content!);
         
        //  if (result.content){
        //    this.result = result.content;
        //    this.sumaPuntos(this.result);
        //  }
       
       } else {
         alert('NO DATA FOUND!');
       }
     } else {
       alert('NOT ALLOWED!');
     }
     document.querySelector('body')!.classList.remove('scanner-active');
     
   }
 
   stopScanner() {
     BarcodeScanner.stopScan();
     this.scanActive = false;
     
     
   }
 
   ionViewWillLeave() {
     BarcodeScanner.stopScan();
     this.scanActive = false;
   }
 
   sumaPuntos(result:string){
    let datacampaign: any;
    let datacampaignCustomer: any;
    //let total: number;
    
    this.supabaseService.getCampaignCard(this.campaign, result)
                        .then((response)=> { this.campaignCard = response;
                                             console.log('Usuario si inscrito en campaña.');  
                                             // insertamos datos en tabla history                                                                         
                                            this.supabaseService.insertCampanyCardHistory(this.company, this.campaign, result, this.points);
                                            this.supabaseService.getCampaign(this.campaign,'id_campaign') //obtengo puntos campaña
                                                                .then((response)=>{
                                                                                   datacampaign = response;
                                                                                   console.log('datos campaña', response);
                                                                                   console.log(datacampaign[0].points_campaign);
                                                                                  });
                                            this.supabaseService.getCampaignCard(this.campaign, result) //obtengo situacion usuario en campaña
                                                                .then((response)=>{
                                                                                   datacampaignCustomer = response;
                                                                                   console.log('datos usuario campaña', response);
                                                                                  let total = (datacampaignCustomer.earned_points_customer_card + (+this.points));
                                                                                  console.log('el total es', total);                                                                                  
                                                                                  let points:number;
                                                                                  let cliente:any;
                                                                                  let no_given_prizes:number=0;
                                                                                  let won_prizes:number=0;
                                                                                  let text_prize: string = "";

                                                                                  if (total < datacampaignCustomer.total_prize){
                                                                                    points = total;
                                                                                    won_prizes = 0; 
                                                                                    text_prize = 'No tienes premio';                                             
                                                                                  } else {
                                                                                    points = total % datacampaignCustomer.total_prize;
                                                                                    won_prizes = Math.trunc(total / datacampaignCustomer.total_prize);
                                                                                    text_prize = won_prizes==1 ? 'Tienes 1 premio nuevo!!!' : 'Tienes ' + won_prizes + ' premios nuevos!!!';
                                                                                    //text_prize = 'No tienes premio'; 
                                                                                  }
                                                                                  no_given_prizes = won_prizes + +datacampaignCustomer.no_given_prices;
                                                                                  console.log('que da', points, no_given_prizes);
                                                                                  this.supabaseService.updateCampanyCard(this.campaign, result, points, no_given_prizes);
                                                                                  this.supabaseService.getCustomer(datacampaignCustomer.customer_id_fk).then((response)=>{cliente=response;
                                                                                                                                                                          console.log(cliente);
                                                                                                                                                                          this.showUser(this.points, text_prize, no_given_prizes, cliente, datacampaign[0].name_campaign, points, datacampaignCustomer.total_prize, result, datacampaignCustomer.given_prizes);
                                                                                                                                                                        })
                                                                                  
                                                                                });
                                              // this.showUser(total); 
                                          })            
                        
                      .catch((error)=>{console.log('Usuario no inscrito en campaña.');
                                      this.errorAlarm()});
 
              
}

   showUser(points:number, text_prize:string, no_given_prizes:number, name:any, campaign:any, total_points:number, total_prize:number, result:string, given_prices:number) {
    this.alertController.create({
      header: text_prize,
      subHeader: `Usuario: ${name.first_name_customer} ${name.last_name_customer} Campaña: ${campaign}`,
      message: `<h6>Puntos añadidos: ${points} </h6>
                <h6>Puntos acumulados: ${total_points} </h6>
                <h6>Puntos para nuevo premio: ${total_prize-total_points} </h6>
                <h6>Premios pendientes: ${no_given_prizes} </h6>`,
      buttons: [
        {
          text: ' Volver a campañas',
          handler: () => {
            this.router.navigate(['/list', this.company, this.terminal]);
          },
        },
        {
          text: ' Consumir premios',
          handler: data => {
            console.log(this.campaign, result, no_given_prizes-data.prize, given_prices, given_prices + 
              +data.prize);
           // 
           this.supabaseService.updateCampanyCardPrizes(this.campaign, result, no_given_prizes-data.prize, +given_prices + +data.prize);
           this.router.navigate(['/list', this.company, this.terminal]);
          },
        },
      ],
      inputs: [
        {
          type: 'number',
          name: 'prize',
          placeholder: 'Prize',
          min: 1,
          max: 100,}
      ]
    }).then(res => {
      res.present();
    });
  }


   errorAlarm() {
    this.alertController.create({
      header: 'Usuario no inscrito en campaña',
      //subHeader: 'Beware lets confirm',
      message: 'Solicite al usuario que se inscriba en la campaña',
      buttons: [
        {
          text: 'Volver a campañas',
          handler: () => {
            this.router.navigate(['/list', this.company, this.terminal]);
          }
        },
       
      ]
    }).then(res => {
      res.present();
    });
  }
 
     
 }