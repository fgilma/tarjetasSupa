import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Profile, SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  profile: Profile = {
    username: '',
    avatar_url: '',
    website: '',
  }

  session = this.supabase.session.then((data) =>data.data.session);

  constructor(private readonly supabase: SupabaseService, private router: Router) {
     this.supabase.session
   }

  ngOnInit() {
    this.getProfile()
    console.log('user', this.supabase.user);
    console.log('sesion', this.supabase.session);
    this.supabase.session.then((response)=>console.log('el id', response.data.session?.user.id))
  }

  async getProfile() {
    try {
      let { data: profile, error, status } = await this.supabase.getProfile()
      if (error && status !== 406) {
        throw error
      }
      if (profile) {
        //this.profile = profile;
        console.log(this.profile);
      }
    } catch (error:any) {
      alert(error.message)
    }
  }

  // async updateProfile(avatar_url: string = '') {
  //   const loader = await this.supabase.createLoader()
  //   await loader.present()
  //   try {
  //     await this.supabase.updateProfile({ ...this.profile, avatar_url })
  //     await loader.dismiss()
  //     await this.supabase.createNotice('Profile updated!')
  //   } catch (error:any) {
  //     await this.supabase.createNotice(error.message)
  //   }
  // }

  async signOut() {
    console.log('testing?')
    await this.supabase.signOut()
    this.router.navigate(['/'], { replaceUrl: true })
  }

}
