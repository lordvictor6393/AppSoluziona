// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Prod Test DB
  // firebase: {
  //   apiKey: 'AIzaSyDvZBswz_fnwHS37rHErR3ghkrAURGhEwc',
  //   authDomain: 'app-soluziona-dev.firebaseapp.com',
  //   databaseURL: 'https://app-soluziona-dev.firebaseio.com',
  //   projectId: 'app-soluziona-dev',
  //   storageBucket: 'app-soluziona-dev.appspot.com',
  //   messagingSenderId: '307434672468'
  // }
  // Dev DB
  firebase: {
    apiKey: 'AIzaSyAwfvV7FgYS4csVBIT_K9QoBB9Ht-HQFQw',
    authDomain: 'app-soluziona-test-db.firebaseapp.com',
    databaseURL: 'https://app-soluziona-test-db.firebaseio.com',
    projectId: 'app-soluziona-test-db',
    storageBucket: 'app-soluziona-test-db.appspot.com',
    messagingSenderId: '466972864769'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
