import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { OAuthService, AuthConfig, OAuthStorage } from 'angular-oauth2-oidc';
//import {InitialAuthService} from '../../../auth/initial-auth.service';
import { Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FinchyConfig } from './finchy.config';
import { FinchyGlobalConfig } from './finchy.global.config';
import { JwksValidationHandler } from './jwks-validation-handler';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class FinchyService {
  public finchyRootUrl;
  private accessTokenSubject: Subject<string>;
  private userIdentitySubject: Subject<object>;
  private _decodedAccessToken: any;
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private _decodedIDToken: any;
  get decodedAccessToken() { return this._decodedAccessToken; }
  get decodedIDToken() { return this._decodedIDToken; }


  constructor(
    private _httpClient: HttpClient,
    private _oAuthStorge: OAuthStorage, private _oAuthService: OAuthService,
    private _finchyGlobalConfig: FinchyGlobalConfig,
    // @Optional() private config: FinchyConfig,
    @Inject(FinchyConfig) private config: FinchyConfig) {
    this._finchyGlobalConfig.setUserValues(this.config);
    this.finchyRootUrl = this.config.finchyRootUrl;
    this.accessTokenSubject = new ReplaySubject<string>();
    this.userIdentitySubject = new ReplaySubject<object>();

    // restart automatic silent refresh if the user refreshed the page while still logged in
    if (this._oAuthService.hasValidAccessToken()) {
      this.emitAccessToken();
      this.emitIdentityClaims();
      if (this._oAuthService.hasValidIdToken() && this._finchyGlobalConfig.silentRefreshEnabled) {
        this._oAuthService.setupAutomaticSilentRefresh();
        this.refreshTokenOnLoadIfNeeded();
      }
    }

    console.log('this._finchyGlobalConfig= ', this._finchyGlobalConfig);
    console.log('this.config= ', this.config);
  }


  login(redirectUriOverride?: string): Promise<Boolean> {
    console.log('\t login()', redirectUriOverride);
    let redirectUri;
    if (redirectUriOverride) {
      redirectUri = redirectUriOverride;
    } else {
      redirectUri = this._finchyGlobalConfig.redirectUri; // config.finchyConfig.redirectUri; // _finchyGlobalConfig.redirectUri;
    }

      const authConfig: AuthConfig = {
        issuer: this._finchyGlobalConfig.authority,
        //issuer: 'https://idsvr4.azurewebsites.net',
        redirectUri: redirectUri,
        clientId: this._finchyGlobalConfig.clientId,
        //clientId: 'spa',
        scope: this._finchyGlobalConfig.scope,
        //responseType: this._finchyGlobalConfig.responseType,
        responseType: 'code',
        requireHttps: this._finchyGlobalConfig.requireHttps,
        sessionChecksEnabled: this._finchyGlobalConfig.sessionChecksEnabled,
        postLogoutRedirectUri: this._finchyGlobalConfig.logoutRedirectUri,
        useIdTokenHintForSilentRefresh: this._finchyGlobalConfig.useIdTokenHintForSilentRefresh,
        silentRefreshRedirectUri: this._finchyGlobalConfig.silentRefreshRedirectUri
    };

    console.log('authConfig= ', authConfig);
    console.log('config= ', this.config);

    this._oAuthService.configure(authConfig);
    this._oAuthService.tokenValidationHandler = new JwksValidationHandler();

    if (!this._oAuthService.hasValidIdToken() || !this._oAuthService.hasValidAccessToken()) {
      if (this._finchyGlobalConfig.silentRefreshEnabled)
          this._oAuthService.setupAutomaticSilentRefresh();
    }

    let that = this;
    let emitInfo = true;
    if (this._oAuthService.hasValidAccessToken()) {
        emitInfo = false;
    }

    return new Promise<boolean>(function(resolve, reject) {
      // FM wtf is this
      //that._oAuthService.tryLogin()
      //  loadDiscoveryDocumentAndLogin method instead of loadDiscoveryDocumentAndTryLogin
      //that._oAuthService.loadDiscoveryDocumentAndTryLogin()
      that._oAuthService.loadDiscoveryDocumentAndLogin()
      .then(response => {
        console.log('\n\t that._oAuthService.tryLogin({})', response);
          resolve(response);
          if (response) {
              if (emitInfo) {
                  that.emitAccessToken();
                  that.emitIdentityClaims();
              }
          }
      })
      .catch(error => {
          reject(error);
      });
    });

    // return new Promise((resolve, reject) =>
    //   resolve(false || !redirectUriOverride)
    // );
  }

  ///
  login22(redirectUriOverride?: string): Promise<void|Boolean> {
    console.log('\t login22()', redirectUriOverride);
    let redirectUri;
    if (redirectUriOverride) {
      redirectUri = redirectUriOverride;
    } else {
      redirectUri = this._finchyGlobalConfig.redirectUri; // config.finchyConfig.redirectUri; // _finchyGlobalConfig.redirectUri;
    }
    console.log(environment);
      const origin = environment.production ? 'https://philly-vanilly.github.io/init-auth' : 'http://localhost:4200';

    //   const authConfig: AuthConfig = {
    //     issuer: 'https://philly-vanilly.auth0.com/', //'https://idsvr4.azurewebsites.net', //this._finchyGlobalConfig.authority,//this._finchyGlobalConfig.authority, 'https://idsvr4.azurewebsites.net',
    //      customQueryParams: { audience: 'https://philly-vanilly.auth0.com/api/v2/' },
    //     redirectUri: `${origin}/index.html`, //'http://localhost:3000/login', //window.location.origin + '/mylogin', // //window.location.origin + '/index.html', //window.location.origin + '/index.html', //redirectUri,
    //      silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
    //     clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV', //'spa', //this._finchyGlobalConfig.clientId, //this._finchyGlobalConfig.clientId, 'spa',
    //     //clientId: 'spa',
    //     scope: 'openid profile email', //this._finchyGlobalConfig.scope,
    //      clearHashAfterLogin: true,
    //      showDebugInformation: true,
    //     //responseType: this._finchyGlobalConfig.responseType,
    //     responseType: this._finchyGlobalConfig.responseType, //'code',
    //     requireHttps: this._finchyGlobalConfig.requireHttps,
    //     sessionChecksEnabled: this._finchyGlobalConfig.sessionChecksEnabled,
    //     postLogoutRedirectUri: this._finchyGlobalConfig.logoutRedirectUri,
    //     useIdTokenHintForSilentRefresh: this._finchyGlobalConfig.useIdTokenHintForSilentRefresh
    //     //silentRefreshRedirectUri: this._finchyGlobalConfig.silentRefreshRedirectUri
    // };
    const authConfig: AuthConfig = environment.authConfig;
    authConfig.logoutUrl =
    `${authConfig.issuer}v2/logout?client_id=${authConfig.clientId}&returnTo=${encodeURIComponent(authConfig.redirectUri!)}`;


    console.log('authConfig= ', authConfig);
    console.log('config= ', this.config);

    this._oAuthService.configure(authConfig);
    this._oAuthService.tokenValidationHandler = new JwksValidationHandler();

    if (!this._oAuthService.hasValidIdToken() || !this._oAuthService.hasValidAccessToken()) {
      if (this._finchyGlobalConfig.silentRefreshEnabled)
          this._oAuthService.setupAutomaticSilentRefresh();
    }

    let that = this;
    let emitInfo = true;
    if (this._oAuthService.hasValidAccessToken()) {
        emitInfo = false;
    }

    return new Promise<void>((resolveFn, rejectFn) => {
      // setup oauthService
      this._oAuthService.configure(authConfig);
      this._oAuthService.setStorage(localStorage);
      this._oAuthService.tokenValidationHandler = new JwksValidationHandler();

      // subscribe to token events
      this._oAuthService.events
        .pipe(filter((e: any) => e.type === 'token_received'))
        .subscribe(() => this.handleNewToken());

      // continue initializing app (provoking a token_received event) or redirect to login-page
      this._oAuthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
      //this.oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
        if (isLoggedIn) {
          this._oAuthService.setupAutomaticSilentRefresh();
          resolveFn();
        } else {
          this._oAuthService.initImplicitFlow();
          rejectFn();
        }
      });
    });
}

private handleNewToken() {
  this._decodedAccessToken = this.jwtHelper.decodeToken(this._oAuthService.getAccessToken());
  this._decodedIDToken = this.jwtHelper.decodeToken(this._oAuthService.getIdToken());
}

    //

  //   return new Promise<boolean>(function(resolve, reject) {
  //     // FM wtf is this
  //     //that._oAuthService.tryLogin()
  //     //that._oAuthService.loadDiscoveryDocumentAndTryLogin()
  //     that._oAuthService.loadDiscoveryDocumentAndLogin()
  //     .then(response => {
  //       console.log('\n\t that._oAuthService.tryLogin({})', response);
  //         resolve(response);
  //         if (response) {
  //             if (emitInfo) {
  //                 that.emitAccessToken();
  //                 that.emitIdentityClaims();
  //             }
  //         }
  //     })
  //     .catch(error => {
  //         reject(error);
  //     });
  //   });

  //   // return new Promise((resolve, reject) =>
  //   //   resolve(false || !redirectUriOverride)
  //   // );
  // }

  ///

  private async refreshTokenOnLoadIfNeeded(): Promise<void> {
    this._oAuthService.timeoutFactor = 0.75;
    const tokenStoredAt:any = sessionStorage.getItem('access_token_stored_at');
    const expiration = this._oAuthService.getAccessTokenExpiration();
    const storedAt = parseInt(tokenStoredAt, 10);
    const timeout = (expiration - storedAt) * this._oAuthService.timeoutFactor;
    const refreshAt = timeout + storedAt;
    const now = Math.round(new Date().getTime() / 1000);
    if (now >= refreshAt) {
        await this._oAuthService.silentRefresh();
    }
}

logout() {
  this._oAuthService.logOut();
}

  private emitAccessToken() {
    alert('emitAccessToken();\n '+this._oAuthService.getAccessToken());
    this.accessTokenSubject.next(this._oAuthService.getAccessToken());
  }


  private emitIdentityClaims() {
    const url = this._finchyGlobalConfig.authority + '/userinfo'; // + '/connect/userinfo';
    console.log('\n\t emitIdentityClaims url= ', url);
        let reqHeaders = new HttpHeaders();
        reqHeaders = reqHeaders.append('Authorization', 'Bearer ' + this._oAuthService.getAccessToken());
        return this._httpClient.get(url,
            {
                headers: reqHeaders,
                observe: 'response'
            }).subscribe((data) => {
                const identityClaims = this._oAuthService.getIdentityClaims();
                // @ts-ignore
                identityClaims['profile'] = data.body['profile'] ? data.body['profile'] : null;
                // @ts-ignore
                identityClaims['email'] = data.body['email'] ? data.body['email'] : null;
                // @ts-ignore
                identityClaims['id'] = data.body['id'] ? data.body['id'] : null;
                // @ts-ignore
                identityClaims['role'] = data.body['role'] ? data.body['role'] : null;
                this.userIdentitySubject.next(identityClaims);
                alert('emitIdentityClaims()\n' + JSON.stringify(data));
                alert('emitIdentityClaims()\n' + JSON.stringify(identityClaims, null, 2));
            });
  }

  private _executeQuery(
    apiUrl: string,
    params: { [index: string]: any },
    errorMsg: string,
    callbackState: undefined
  ): Observable<{ queryResult: Finchy.QueryResult; callbackState: any }> {
    let form_data = null;
    if (!isNonNullObject(params)) {
      params = {
        resultformat: 'JSON',
      };
    }
    if (isNonNullObject(params)) {
      params['resultformat'] = 'JSON';
      form_data = this.getFormUrlEncodedData(params);
    }

    return <
      Observable<{ queryResult: Finchy.QueryResult; callbackState: any }>
    >this._httpClient
      .post(apiUrl, form_data, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(
        map((data) => {
          const queryResult = new Finchy.QueryResult(data);
          return { queryResult: queryResult, callbackState: callbackState };
        }),
        catchError((error) => {
          const finchyEx = new Finchy.FinchyException(errorMsg, {
            status: error.status,
            statusText: error.statusText,
            response: error.responseJSON,
          });
          return throwError({
            finchyException: finchyEx,
            callbackState: callbackState,
          });
        })
      );
  }

  executeQuery(
    domain: string,
    query: string,
    params: any,
    callbackState?: undefined
  ): Observable<{ queryResult: Finchy.QueryResult; callbackState: any }> {
    if (!isNonNullOrWhitespaceString(domain))
      throw new Finchy.FinchyException('Domain must be a valid string', domain);
    if (!isNonNullOrWhitespaceString(query))
      throw new Finchy.FinchyException('Query must be a valid string', query);
    let apiUrl = this.finchyRootUrl + '/API/' + domain + '/' + query;
    let errorMsg =
      'Failed to execute query ' + query + ' within domain ' + domain;

    return <
      Observable<{ queryResult: Finchy.QueryResult; callbackState: any }>
    >this._executeQuery(apiUrl, params, errorMsg, callbackState).pipe(
      map((response) => response),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Timestamp: 2016.03.07-12:29:28 (last modified)
  // Author(s): Bumblehead (www.bumblehead.com), JBlashill (james@blashill.com), Jumper423 (jump.e.r@yandex.ru)
  //
  // http://www.w3.org/TR/html5/forms.html#url-encoded-form-data
  // input: {one:1,two:2} return: '[one]=1&[two]=2'
  getFormUrlEncodedData(data: { [x: string]: any }, opts?: any) {
    'use strict';

    // ES5 compatible version of `/[^ !'()~\*]/gu`, https://mothereff.in/regexpu
    let encodechar = new RegExp(
      [
        '(?:[\0-\x1F"-&+-}\x7F-\uD7FF\uE000-\uFFFF]|',
        '[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|',
        '(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])',
      ].join(''),
      'g'
    );

    opts = typeof opts === 'object' ? opts : {};

    function encode(value: string) {
      return String(value)
        .replace(encodechar, encodeURIComponent)
        .replace(/ /g, '+')
        .replace(/[!'()~\*]/g, function (ch) {
          return '%' + ch.charCodeAt(0).toString(16).slice(-2).toUpperCase();
        });
    }

    function keys(obj: { [x: string]: any }) {
      let itemsKeys = Object.keys(obj);

      return opts.sorted ? itemsKeys.sort() : itemsKeys;
    }

    function filterjoin(arr: any[]) {
      return arr
        .filter(function (e) {
          return e;
        })
        .join('&');
    }

    function objnest(name: string, obj: any): any {
      return filterjoin(
        keys(obj).map(function (key) {
          return nest(name + '[' + key + ']', obj[key]);
        })
      );
    }

    function arrnest(name: string, arr: any[]): any {
      return arr.length
        ? filterjoin(
            arr.map(function (elem, index) {
              return nest(name + '[' + index + ']', elem);
            })
          )
        : encode(name + '[]');
    }

    function nest(name: string, value: string) {
      let type = typeof value,
        f = null;

      if (value === f) {
        f = opts.ignorenull ? f : encode(name) + '=' + f;
      } else if (/string|number|boolean/.test(type)) {
        f = encode(name) + '=' + encode(value);
      } else if (Array.isArray(value)) {
        f = arrnest(name, value);
      } else if (type === 'object') {
        f = objnest(name, value);
      }

      return f;
    }

    return (
      data &&
      filterjoin(
        keys(data).map(function (key) {
          return nest(key, data[key]);
        })
      )
    );
  }
}

export namespace Finchy {
  export class FinchyException {
    message: string;
    data: any;
    name: string;

    constructor(message: string, data?: any) {
      this.message = message;
      this.data = data;
      this.name = 'FinchyException';
    }

    logError(): void {
      console.error(this.message, this.data);
    }
  }

  export class QueryResult {
    _columnsByName: { [x: string]: { idx: any } } | undefined;
    _columnsByIdx: any;
    _currentRowIdx = -1;

    _jsonResult: any;

    constructor(_jsonResult: any) {
      this._jsonResult = _jsonResult;
      this.processColumnHeaders();
    }

    convertToObject(key: string): Object {
      let colCount = this.getColCount();
      if (colCount < 2)
        throw new FinchyException(
          'Result sets can only be convered to objects when they have at least two columns. The column count is ' +
            colCount,
          { jsonResult: this._jsonResult }
        );
      this.resetIterator();
      let result: any = {};
      let keyColIdx = this.validateAndConvertColumnReferenceToIdx(key);
      while (this.moveToNextRow()) {
        let keyValue = this.getCellValue(keyColIdx);
        if (isUndefined(keyValue))
          throw new FinchyException(
            'Key value when attempting to convert result set to object can not be undefined',
            {
              val: keyValue,
              rowIdx: this._currentRowIdx,
              jsonResult: this._jsonResult,
            }
          );
        if (!isUndefined(result[keyValue]))
          throw new FinchyException(
            'Duplicate key found when attempting to convert result set to object',
            {
              val: keyValue,
              rowIdx: this._currentRowIdx,
              jsonResult: this._jsonResult,
            }
          );
        if (colCount === 2) {
          for (let i = 0; i < colCount; i++) {
            if (i === keyColIdx) continue;
            result[keyValue] = this.getCellValue(i);
          }
        } else {
          result[keyValue] = {};
          for (let j = 0; j < colCount; j++) {
            if (j === keyColIdx) continue;
            let columnName = this._columnsByIdx[j].columnName;
            result[keyValue][columnName] = this.getCellValue(j);
          }
        }
      }
      return result;
    }

    csvToArray(text: any): any {
      if (text === null) return null;
      if (!isString(text))
        throw new FinchyException(
          'Input text for csv to array conversion is not a string',
          text
        );
      if (text.killWhiteSpace() === '') return [];
      let re_valid =
        /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
      let re_value =
        /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
      // Throw an exception if input string is not well formed CSV string.
      if (!re_valid.test(text))
        throw new FinchyException('Input text is not a valid csv string', text);
      let a = []; // Initialize array to receive values.
      text.replace(
        re_value, // "Walk" the string using replace with callback.
        function (
          m0: any,
          m1: string | undefined,
          m2: string | undefined,
          m3: undefined
        ) {
          // Remove backslash from \' in single quoted values.
          if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
          // Remove backslash from \" in double quoted values.
          else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return ''; // Return empty string.
        }
      );
      // Handle special case of empty last value.
      if (/,\s*$/.test(text)) a.push('');
      return a;
    }

    getCellValue(col: string | number): any {
      if (this._currentRowIdx >= this.getRowCount())
        throw new FinchyException(
          'Unable to retrieve column value as the iterator is out of the bounds of the result set. Current row index is ' +
            this._currentRowIdx +
            ', while the total row count is ' +
            this.getRowCount()
        );
      let colIdx = this.validateAndConvertColumnReferenceToIdx(col);
      let rowDataArray = this._jsonResult.data[this._currentRowIdx];
      if (!isNonZeroLengthArray(rowDataArray))
        throw new FinchyException(
          'Failed to retrieve column value. Row data for index ' +
            this._currentRowIdx +
            ' is in an unexpected format (i.e. not an array of values)'
        );
      return rowDataArray[colIdx];
    }

    getColCount(): number {
      if (
        !isNonNullObject(this._jsonResult) ||
        !isNonZeroLengthArray(this._jsonResult.schema)
      )
        return 0;
      return this._jsonResult.schema.length;
    }

    getColNames(): Array<string> {
      const bbb = this._columnsByIdx ? this._columnsByIdx : [];
      return bbb.map(function (obj: { columnName: any }) {
        return obj.columnName;
      });
    }

    getCurrentRowIdx(): number {
      return this._currentRowIdx;
    }

    getColumns(): Array<{ columnName: string; type: string }> {
      // creates a cloned version of the column list
      return this._columnsByIdx.map(function (obj: {
        columnName: any;
        type: any;
      }) {
        return {
          columnName: obj.columnName,
          type: obj.type,
        };
      });
    }

    getMultiSelectCellValue(col: string): Array<string> {
      let textValue = this.getCellValue(col);
      if (!isNonNullOrWhitespaceString(textValue)) return [];
      return this.csvToArray(textValue);
    }

    getRowCount(): number {
      if (
        !isNonNullObject(this._jsonResult) ||
        !isNonZeroLengthArray(this._jsonResult.data)
      )
        return 0;
      return this._jsonResult.data.length;
    }

    toObjectArray(): Array<Object> {
      let result: Object[] = [];
      this._jsonResult.data.forEach((row: string | any[]) => {
        let rowObject: any = {};
        for (let i = 0; i < row.length; i++) {
          rowObject[this._jsonResult.schema[i].columnName] = row[i];
        }
        result.push(rowObject);
      });
      return result;
    }

    moveToNextRow() {
      if (this._currentRowIdx < this.getRowCount()) {
        this._currentRowIdx++;
      } else {
        this._currentRowIdx = this.getRowCount();
      }
      return this._currentRowIdx < this.getRowCount();
    }

    moveToRow(idx: number) {
      if (idx < 0 || idx >= this.getRowCount())
        throw new FinchyException(
          'Failed to move to row ' +
            idx +
            '. The specified index is out of the bounds of the result set which contains ' +
            this.getRowCount() +
            ' records'
        );
      this._currentRowIdx = idx;
    }

    private processColumnHeaders() {
      this._columnsByName = {};
      this._columnsByIdx = [];
      if (
        !isNonNullObject(this._jsonResult) ||
        !isNonZeroLengthArray(this._jsonResult.schema)
      )
        return;
      for (let i = 0; i < this._jsonResult.schema.length; i++) {
        let colSpec = this._jsonResult.schema[i];
        if (!isNonNullObject(colSpec))
          throw new FinchyException(
            'Failed to parse column schema for column at index ' +
              i +
              '. Value is either null or not an object',
            this._jsonResult
          );
        if (!isNonNullOrWhitespaceString(colSpec.columnName))
          throw new FinchyException(
            'Failed to parse column schema for column at index ' +
              i +
              '. Column name is invalid',
            this._jsonResult
          );
        if (!isNonNullOrWhitespaceString(colSpec.type))
          throw new FinchyException(
            'Failed to parse column schema for column at index ' +
              i +
              '. Column type is invalid',
            this._jsonResult
          );
        if (!isUndefined(this._columnsByName[colSpec.columnName]))
          throw new FinchyException(
            'Failed to parse column schema for column at index ' +
              i +
              '. Column name is not unique',
            this._jsonResult
          );

        // this._columnsByName[colSpec.columnName] = {
        //     type: colSpec.type,
        //     idx: i
        // };
        this._columnsByIdx[i] = {
          columnName: colSpec.columnName,
          type: colSpec.type,
        };
      }
    }

    resetIterator() {
      this._currentRowIdx = -1;
    }

    validateAndConvertColumnReferenceToIdx(col: any) {
      if (isNonNullOrWhitespaceString(col)) {
        //return null;
        // if (!isNonNullObject(this._columnsByName[col]))
        throw new FinchyException(
          'Failed to retrieve column value. Column ' +
            col +
            ' could not be found in the result set'
        );
        // return this._columnsByName[col].idx;
      } else if (isInteger(col)) {
        if (col >= 0 && col < this.getColCount()) {
          return col;
        } else {
          throw new FinchyException(
            'Failed to retrieve column value. The specified index value of ' +
              col +
              ' is outside of the bounds of the result set which has ' +
              this.getColCount() +
              ' columns'
          );
        }
      } else {
        throw new FinchyException(
          'Failed to retrieve column value. Parameter col must either be a valid column name belonging to the result set or a column index',
          { colParameterValue: col }
        );
      }
    }
  }
}

function isFunction(obj: any): boolean {
  return typeof obj === 'function';
}

function isNonNullOrWhitespaceString(text: string): boolean {
  if (typeof text !== 'string') return false;
  let re = /\s/gi;
  let result = text.replace(re, '');
  return result !== '';
}

function isNonNullObject(obj: any): boolean {
  return typeof obj === 'object' && obj !== null;
}

function isUndefined(obj: any): boolean {
  return typeof obj === 'undefined';
}

function isBoolean(obj: any): boolean {
  return typeof obj === 'boolean';
}

function isString(obj: any): boolean {
  return typeof obj === 'string';
}

function isInteger(obj: any): boolean {
  return Number.isInteger(obj);
}

function isNonZeroLengthArray(obj: string | any[]) {
  if (!Array.isArray(obj)) return false;
  if (obj.length === 0) return false;
  return true;
}

@Injectable()
export class FinchyAuthInterceptor implements HttpInterceptor {
  constructor(
    private _finchyGlobalConfig: FinchyGlobalConfig,
    private _oAuthStorage: OAuthStorage
  ) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isNonNullOrWhitespaceString(this._finchyGlobalConfig.finchyRootUrl))
      return next.handle(req);

    let url = req.url.toLowerCase();

    if (url.startsWith(this._finchyGlobalConfig.finchyRootUrl.toLowerCase())) {
      if (!req.headers.has('Authorization')) {
        let token = this._oAuthStorage.getItem('access_token');
        let header = 'Bearer ' + token;
        let headers = req.headers.set('Authorization', header);
        req = req.clone({ headers });
      }
    }
    return next.handle(req);
  }
}
function resolveFn() {
  throw new Error('Function not implemented.');
}

function rejectFn() {
  throw new Error('Function not implemented.');
}

