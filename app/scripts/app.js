'use strict';

/**
 * @ngdoc overview
 * @name chatappApp
 * @description
 * # chatappApp
 *
 * Main module of the application.
 */
var app=angular
  .module('chatappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pubnub.angular.service'
  ])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'JoinCtrl',
        controllerAs: 'join'
      })
      .otherwise({
        redirectTo: '/join'
      });
  }]);
