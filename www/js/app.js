// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function($scope) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }


    });
});

// When running in a Cordova environment, bootstrap
// only after the device is ready. This makes it possible
// to call Cordova plugins in the Angular components without
// checking there whether device is ready or not.
(function() {
    if (window.cordova) {
        console.log('Cordova found');
        document.addEventListener("deviceready", function() {
            angular.bootstrap(document, ['starter']);
        }, false);
    } else {
        console.log('No cordova');
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['starter']);
        });
    }
})();
