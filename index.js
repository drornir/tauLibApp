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
                data:{
                    stateTitle: 'כניסה'
                }
            })
            .state('reservation', {
                url: "/reservation",
                templateUrl: "reservation.html",
                controller: "reservation",
                data:{
                    stateTitle:  'הזמנה'
                }
            })
            .state('filter', {
                url: "/filter",
                templateUrl: "filterRooms.html",
                controller: "filterRooms",
                data:{
                    stateTitle: 'פילטור'
                }
            })
            .state('room', {
                url: "/showTables",
                templateUrl: "room.html",
                controller: "room",
                data:{
                    stateTitle:  'שולחנות'
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