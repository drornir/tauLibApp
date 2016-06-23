/**
 * Created by nitzanh on 4/23/16.
 */

var app = angular.module('app', ['ui.router', 'ui.bootstrap'])
    .run(function ($rootScope) {
            $rootScope.serverUrl = 'http://127.0.0.1:3000';
        }
    ).config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "login.html",
                controller: "login",
                resolve:{
                    stateTitle: function(){return 'כניסה'}
                }
            })
            .state('reservation', {
                url: "/reservation",
                templateUrl: "reservation.html",
                controller: "reservation",
                resolve:{
                    stateTitle: function(){return 'הזמן שולחן'}
                }
            })
            .state('filter', {
                url: "/filter",
                templateUrl: "filterRooms.html",
                controller: "filterRooms",
                resolve:{
                    stateTitle: function(){return 'Login'}
                }
            })
            .state('room', {
                url: "/showTables",
                templateUrl: "room.html",
                controller: "room",
                resolve:{
                    stateTitle: function(){return 'Login'}
                }
            })

    })
// .config(function ($httpProvider) {
//     $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//     $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT';
//     $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
//     $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
//
// });