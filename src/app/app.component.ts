import { Component, OnInit } from "@angular/core";
//import { CinchyConfig, CinchyService } from '@cinchy-co/angular-sdk';
import { Question } from "./Question";
import { Person } from "./Person";
//import { DomSanitizer } from "@angular/platform-browser";
import { FinchyService } from "./shared/services/finchy/finchy.service";
import { FinchyConfig } from "./shared/services/finchy/finchy.config";
import { environment } from "src/environments/environment";
import {InitialAuthService} from '../app/auth/initial-auth.service';

export const MyCinchyAppConfig: FinchyConfig = {
  finchyRootUrl: "http://localhost:9000",
  authority:  "http://localhost:8080", //"http://localhost:3000",  //"http://localhost:4000", //"http://localhost:8081",
  redirectUri: "http://localhost:4200/",
  clientId: "alvin-rest-sample",
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [
    FinchyService,
    {
      provide: FinchyConfig,
      useValue: MyCinchyAppConfig,
    },
  ],
})
export class AppComponent implements OnInit {
  title = "Curiousity";
  questions: any;
  echo: any;
  leaderboard: Person[] = [];
  currentAnswer = "";
  currentUserCanAnswer: boolean | undefined;

  userIdentity: object | undefined;
  public inchyService: FinchyService;
  constructor(private _finchyService: FinchyService,
    private initalAuthService: InitialAuthService) {
    this.inchyService=_finchyService;
    //console.log('inchy', _finchyService)

    // this._finchyService
    //   .login()
    //   .then((response) => {

    //     console.log(response);
    //     console.log("Logged In!");

    //     this.fetchAndLoadInitialData();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });


    // this._cinchyService.login().then( response => {
    //   console.log(response);
    //   console.log('Logged In!');

    //   // Loads initial data by executing multiple queries
    //   this.fetchAndLoadInitialData();

    //   // If user is entitled to answer, display option to answer
    //   this.checkIfUserIsEntitledToAnswer();

    //   // Simply logs access rights groups of current user
    //   this.logGetGroupsCurrentUserBelongsTo();

    //   // Logs the current user's information
    //   this._cinchyService.getUserIdentity().subscribe(
    //     userIdentityResp => {
    //       this.userIdentity = userIdentityResp;
    //     }
    //   );

    // }).catch( error => {
    //   console.log(error);
    // });
  }
  ngOnInit(): void {
    console.log(environment);
    //this.env = environment.environment;
  }

  // Fetches Questions and Leaderboard data
  fetchAndLoadInitialData() {
    const queriesToExecute = [
      {
        domain: "SDK Demo",
        query: "Get Questions",
        params: null,
        callbackState: null,
      },
      {
        domain: "SDK Demo",
        query: "Get Questions", //'Get Leaderboard',
        params: null,
        callbackState: null,
      },
    ];

    this._finchyService
      .executeQuery(
        queriesToExecute[0].domain,
        queriesToExecute[0].query,
        queriesToExecute[0].params
      )
      .subscribe(
        (response) => {
          this.loadQuestions(response);
        },
        (error) => {
          console.log(error);
        }
      );

    this._finchyService
      .executeQuery(
        queriesToExecute[1].domain,
        queriesToExecute[1].query,
        queriesToExecute[1].params
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // Checks if user can add rows to the Answers table
  checkIfUserIsEntitledToAnswer() {
    const domain = "SDK Demo";
    const tableName = "Answers";

    // this._cinchyService.getTableEntitlementsByName(domain, tableName)
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //       this.currentUserCanAnswer = response['canAddRows'];
    //     }
    //   );
  }

  // Takes the response of Questions data and parses it and loads it
  loadQuestions(response: { queryResult: any; callbackState?: any; }) {
    console.log("loadQuestions(response)= ", response);
    const result = response.queryResult;

    // Logging the result as an array of rows
    console.log(result.toObjectArray());
    this.questions = result.toObjectArray()
  }

   // fetches groups and just logs it
  logGetGroupsCurrentUserBelongsTo() {
    // this._cinchyService.getGroupsCurrentUserBelongsTo()
    // .subscribe(
    //   response => {
    //     console.log('Groups Current User Belongs to:');
    //     console.log(response);
    // });
  }

  getXYZ() {
    //alert('getXYZ');
    // Loads initial data by executing multiple queries
    this.fetchAndLoadInitialData();
  }

  getEcho() {
    //alert('getEcho');
    // Loads initial data by executing multiple queries
    //this.fetchAndLoadInitialData();
    const sz =`SELECT *
    FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog' AND
        schemaname != 'information_schema';`;

    const params = {id: 321, sql: sz}; //'select * from public."Products" WHERE id = 3'};//{};
    const domain = 'http://localhost:3000/users'; //"SDK Demo";
    const api = 'bysql'; //"Get Questions"; // 'echo',

    this._finchyService
      .executeQueryExt(
        domain,
        api,
        params
      )
      .subscribe({
          next: (v: {
            queryResult: any;
            callbackState?: any;
        }) => {
          const result = v.queryResult.toObjectArray()
          console.log(v.queryResult.toObjectArray());
          this.echo = result;

        },
          error: (e) => console.error(e),
          complete: () => {console.info;
            // console.log(resp.toObjectArray());
            // this.questions = resp.toObjectArray()
          }
      });
      //   (response) => {
      //     console.log(response);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
  }

  login() {
    this._finchyService.login22().then(() => console.log("Login Complete!"),
    (err) => console.log("Login Errored!", err),
    );
  }

  logout() {
    alert('about to logout!!!!!!!');
    this._finchyService.logout();
  }

  get accessToken(): string {
    return this.initalAuthService.decodedAccessToken;
    //return this._finchyService.decodedAccessToken;
  }

  get idToken(): string {
    return this.initalAuthService.decodedIDToken;
  }

}
