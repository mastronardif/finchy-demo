import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

//import { CinchyModule} from '@cinchy-co/angular-sdk';
//import { FinchyModule } from './shared/services/finchy.module';
/* Feature Modules */

import { FinchyService } from './shared/services/finchy/finchy.service';

import { HttpClientModule } from '@angular/common/http';
import { FinchyModule } from './shared/services/finchy/finchy.module';
import { MyloginComponent } from './comps/mylogin/mylogin.component';
@NgModule({
  declarations: [
    AppComponent,
    MyloginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //FormsModule,
    FinchyModule.forRoot(),

    // FinchyModule.forRoot({
    //   finchyConfig: { authority: '', clientId: 'cccc', redirectUri: 'http://localhost:4200/', finchyRootUrl: 'http://localhost:9000', logoutRedirectUri: '', scope: '', silentRefreshEnabled: true, silentRefreshRedirectUri: '' }
    //  // userName: '',
    //   //userName22: ''
    // }),
    RouterModule.forRoot([
      {path: 'mylogin', component: MyloginComponent},
      //{path: 'heroes-list', component: HeroesListComponent},
    ]),
  ],
  providers: [FinchyService],
  //providers: [CinchyModule, FinchyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
