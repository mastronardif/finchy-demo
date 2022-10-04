// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environment: 'Local',
  authConfig:  {
    issuer: 'https://philly-vanilly.auth0.com/',
    customQueryParams: { audience: 'https://philly-vanilly.auth0.com/api/v2/' },
    redirectUri: `${origin}/index.html`,
    silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
    clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV',
    scope: 'openid profile email',
    clearHashAfterLogin: true,
    showDebugInformation: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
