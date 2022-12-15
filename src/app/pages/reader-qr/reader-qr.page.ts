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
  result!: string;
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
   
    if (this.platform.is('mobileweb')){
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
                                                                                  let no_given_prizes:number=0;

                                                                                  if (total < datacampaignCustomer.total_prize){
                                                                                    points = total;                                                
                                                                                  } else {
                                                                                    points = total % datacampaignCustomer.total_prize;
                                                                                    no_given_prizes = Math.trunc(total / datacampaignCustomer.total_prize);
                                                                                  }
                                                                                  no_given_prizes = no_given_prizes + +datacampaignCustomer.no_given_prices;
                                                                                  console.log('que da', points, no_given_prizes);
                                                                                  this.supabaseService.updateCampanyCard(this.campaign, result, points, no_given_prizes);
                                                                                 
                                                                                });
                                              this.showUser(); 
                                          })            
                        
                      .catch((error)=>{console.log('Usuario no inscrito en campaña.');
                                      this.errorAlarm()});
 
              
}

   showUser() {
    this.alertController.create({
      header: 'Puntos añadidos correctamente',
      //subHeader: ''+ this.campaign,
      //message: 'Are you sure? you want to leave without safty mask?',
      buttons: [
        {
          text: ' Volver a campañas',
          handler: () => {
            this.router.navigate(['/list', this.company, this.terminal]);
          }
        },
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