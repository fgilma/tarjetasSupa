import { Injectable } from '@angular/core'
import { LoadingController, ToastController } from '@ionic/angular'
import { AuthChangeEvent, AuthResponse, createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment'

export interface Profile {
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase: SupabaseClient //SupaBase Client

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }


//Sign in with email and password

signInWithEmail(email: string, password: string) {
  return new Promise(async(resolve, reject)=> {
    const { data:{user, session}, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error){
      reject(error);
    }else{
      resolve(user);
    }
  }) 
}

signup(email: string, password: string){
  return new Promise(async (resolve, reject)=>{
    const { data, error } = await this.supabase.auth.signUp({ email,password });
    if (error){
      reject(error);
    }else{
      resolve(data.user);
    }
  })
}

//Customer
async getCustomer(id:number){  
  let { data: customer, error } = await this.supabase
  .from('customer')
  //.select('name_company')
  .select('*')
  .eq('id_customer', id)
  .single()
  return customer;

}
   
//Company

async getAllCompany(){  
  let { data: company, error } = await this.supabase
  .from('company')
  //.select('name_company')
  .select('*')
  return company;

}

async getCompany(id:number){  
  let { data: company, error } = await this.supabase
  .from('company')
  .select('name_company')
  .eq('id_company', id)
  .single()
  //.select('*')
  return company;
}

//terminal
async getTerminal(id_company:number){ 
  let { data: terminal, error } = await this.supabase
  .from('terminal')
  .select('*') 
  .eq('company_id_fk', id_company)
  return terminal;
}

// async loginTerminal(user:string, password:string){
//   let { data: terminal, error } = await this.supabase
//   .from('terminal')
//   .select('*') 
//   .eq('user_terminal', user)
//   .eq('password_terminal', password)
//   .single()
//   return terminal;
// }

loginTerminal(user:string, password:string){
  return new Promise(async (resolve, reject)=>{
  let { data: terminal, error } = await this.supabase
  .from('terminal')
  .select('*') 
  .eq('user_terminal', user)
  .eq('password_terminal', password)
  .single()
  if (error){
    reject(error);
  }else{
    resolve(terminal);
  }
})
}

//campaign
async getCampaign(id_company:number, column:string){
  let { data: campaign, error } = await this.supabase
  .from('campaign')
  .select('*') 
  .eq(column, id_company)
  return campaign;

}


//campagin and card customer

getCampaignCard(id_campaign:number, id_customer:any){
 
  return new Promise(async(resolve, reject)=>{
    let { data: campaignCard, error } = await this.supabase
    .from('customer_card')
    .select('*') 
    .eq('customer_id_fk', id_customer)
    .eq('campaign_id_fk', id_campaign)
    .single();
    if (error){
      reject(error);
    }else{
      resolve(campaignCard);
    }
  }
    )
}

async getCampaignCardFK(campaign_id_fk:number){

  let { data: customer_card, error } = await this.supabase
  .from('customer_card')
  .select(`
    name_campaign,
    customer (
      campaign_id_fk
    )
  `)
  return customer_card

}
//history 
async insertCampanyCardHistory(company_id_fk:number,campaign_id_fk:number, customer_id_fk:string, points:number){
  const { data, error } = await this.supabase
  .from('history')
  .insert([
    { 'company_id_fk': company_id_fk, 'campaign_id_fk': campaign_id_fk, 'customer_id_fk':customer_id_fk,'points':points },
  ])
}


async updateCampanyCard(campaign_id_fk:number, customer_id_fk:string, earned_points_customer_card: number,
                         no_given_prizes:number ){
  const { data, error } = await this.supabase
  .from('customer_card')
  .update({ 'earned_points_customer_card': earned_points_customer_card,
            'no_given_prices': no_given_prizes, })
  .eq('campaign_id_fk', campaign_id_fk)
  .eq('customer_id_fk', customer_id_fk)
}

async updateCampanyCardPrizes(campaign_id_fk:number, customer_id_fk:string,
  no_given_prizes:number, given_prices: number ){
const { data, error } = await this.supabase
.from('customer_card')
.update({ 
'given_prizes': given_prices,
'no_given_prices': no_given_prizes, })
.eq('campaign_id_fk', campaign_id_fk)
.eq('customer_id_fk', customer_id_fk)
}




  async getUser(){
    const {
      data: { session },
    } = await this.supabase.auth.getSession()
    return session?.user.id

  }

  get user() {
    return this.supabase.auth.getUser()
  }
  

  get session() {
    return this.supabase.auth.getSession()
  }

  get profile() {
    // this.user.then((response)=> console.log('sin asyn', response.data.user!.id));
    // console.log('con async',this.getUser())
   
    return this.supabase
      .from('profiles')      
      .select(`username, website, avatar_url`)
      //.eq('id', this.user?.then((response)=>response.data.user?.id))
      .eq('id', this.getUser())
      .single()
  }

  async getProfile(){
    const id = (await this.user).data.user?.id;
    return await this.supabase
                                      .from('profiles')
                                      .select(`username, website, avatar_url`)
                                      .eq('id', id)
    //return data
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string): Promise<AuthResponse>{
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.then((response)=>response.data.user?.id),
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update, {
      //returning: 'minimal', // Don't return the value after inserting
    })
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 })
    await toast.present()
  }

  createLoader() {
    return this.loadingCtrl.create()
  }
}