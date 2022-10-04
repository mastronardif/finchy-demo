import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FinchyService } from './finchy.service';
import { FinchyGlobalConfig } from './finchy.global.config';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { FinchyService, FinchyAuthInterceptor} from './finchy.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InitialAuthService } from 'src/app/auth/initial-auth.service';
import { AuthModule } from 'src/app/auth/auth.module';
//import { FinchyConfig } from './finchy.config';
// export * from './finchy.service';
// export * from './finchy.config';
// export * from './finchy.global.config';
// export declare class FinchyModule {
//     static forRoot(): ModuleWithProviders;
// }

@NgModule({
  imports:      [ CommonModule,
    AuthModule,
    OAuthModule.forRoot()
  ],
  // declarations: [ GreetingComponent ],
  // exports:      [ GreetingComponent ]
})
export  class FinchyModule {
  //static forRoot(): ModuleWithProviders;

  constructor(@Optional() @SkipSelf() parentModule?: FinchyModule) {
    if (parentModule) {
      throw new Error(
        'FinchyModule is already loaded. Import it in the AppModule only');
    }
  }



  static forRoot(): ModuleWithProviders<FinchyModule> {
    return{
        ngModule: FinchyModule,
        providers: [
          OAuthService, FinchyService, FinchyGlobalConfig,

          // {
          //   provide: APP_INITIALIZER,
          //   useFactory: (initialAuthService: InitialAuthService) => () => initialAuthService.initAuth(),
          //   deps: [InitialAuthService],
          //   multi: true
          // },

          {
          provide: HTTP_INTERCEPTORS,
          useClass: FinchyAuthInterceptor,
          multi: true
        }],
    };
}

//  static forRoot(config: FinchyServiceConfig): ModuleWithProviders<FinchyModule> {
    // return {
    //   ngModule: FinchyModule,
    //   providers: [OAuthService, FinchyGlobalConfig,
    //     {provide: FinchyServiceConfig, useValue: config }
    //   ]
    // };
  // }
}
