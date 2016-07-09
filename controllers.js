/**
 * Created by nitzanh on 4/23/16.
 */
angular.module('app')
    .controller('main', function($scope,$state,$rootScope){
        $scope.state = $state;
        $scope.$state = $state;
        $rootScope.showLoginIcon = true;
        $rootScope.logout = function(){
            $state.go('login');
        }
        $rootScope.goToFilter = function(){
            $state.go('filter');
        }
    })
    .controller('login', function ($scope, $http, $rootScope, $state) {
        $rootScope.showLoginIcon = false;
        $scope.$on('$destroy', function(){
            $rootScope.showLoginIcon = true;
        })
        
        $scope.submitLogin = function () {
            var username = document.getElementById("tauUsername").value;
            $http.get($rootScope.serverUrl+'/user/' + username, {})
                .then(function (response) {
                    if (response.data.user == null) {
                        $scope.errorMsg = "Error: unrecognized user";
                    } else {
                        $rootScope.tauUserId = response.data.user.user_id;
                        var reservedTable = response.data.reserved_table;
                        if (typeof reservedTable !== 'undefined' && reservedTable !== null) {
                            $rootScope.reservedTable = reservedTable;
                            $state.go('reservation');
                        } else {
                            $state.go('filter');
                        }
                    }
                })
                .catch(function (error) {
                    document.getElementById("loginFailResponse").value = "Error: " + error.errorCode;
                });
        }
    })
    .controller('reservation', function ($scope, $http, $rootScope, $state) {
        // document.getElementById('reservedTable').value = JSON.stringify($rootScope.reservedTable);
        $scope.init = function(){
            $scope.reservedTable = Json.stringify($rootScope.reservedTable);
        };
        $scope.cancelReservation = function () {
            $http.post($rootScope.serverUrl+'/user/' + tauUserId + '/cancel_reservation', {})
                .then(function (response) {
                    $state.go('filter');
                })
                .catch(function (error) {
                    //if (response.status === 400) {}
                    $state.go('login');
                });
        }
    })
    .controller('filterRooms', function ($scope, $http, $rootScope, $state) {
        $scope.libs = [
            {
                displayName: "ספריית מדעים מדוייקים",
                name: "L1",
                floors: [
                    {
                        id: "F0",
                        rooms: [
                            {
                                id: 0
                            },
                            {
                                id: 1
                            }
                        ]
                    },
                    {
                        id: "F1",
                        rooms: [
                            {
                                id: "R1"
                            },
                            {
                                id: "R2"
                            }
                        ]
                    }
                ]
            },
            {
                displayName: "ספריית מדעי החברה",
                name: "social",
                floors: [
                    {
                        id: 0,
                        rooms: [{
                            id: 0
                        }]
                    }]
            }
        ]

        $scope.send = function () {

            $http.get($rootScope.serverUrl+'/table/vacant', {
                    params: {
                        library: $scope.selectedLib.name,
                        floor: $scope.selectedFloor.id,
                        room: $scope.selectedRoom.id
                    }
                })
                .then(function (response) {
                    // $rootScope.vacantTables = response.data.tables;
                    $rootScope.vacantTables = response.data;
                    $rootScope.selectedLib = $scope.selectedLib;
                    $rootScope.selectedFloor = $scope.selectedFloor;
                    $rootScope.selectedRoom = $scope.selectedRoom;
                    console.log(response);
                    //console.log(response.data);
                    $state.go('room');
                    //console.log($state.get());
                })
                .catch(function (error) {
                    alert(error)
                });
        }

    })
    .controller('room', function ($scope, $http, $rootScope, $state) {
        $rootScope.showBackButton = true;
        $scope.$on('$destroy', function(){
            $rootScope.showBackButton = false;
        });
        $scope.init= function(){
            $scope.available = {};
            $rootScope.vacantTables.forEach(function(table){
                $scope.available[table.tableId] = true;
            })
        };

        $scope.reserveTable = function (tableInfo) {
            $http.post($rootScope.serverUrl+'/reserveTable', tableInfo)
                .then(function (response) {
                    console.log(response.data);
                    return $http.get($rootScope.serverUrl+'/getVacantTables', {
                            params: {
                                library: $rootScope.selectedLib.name,
                                floor: $rootScope.selectedFloor.id,
                                room: $rootScope.selectedRoom.id
                            }
                        })
                        .then(function (response) {
                            $rootScope.vacantTables = response.data.tables;
                            $scope.init();
                        })

                })
                .catch(function (error) {
                    // alert(error)
                });
        }

        // $scope.resetDB = function(){
        //     $http.post($rootScope.serverUrl+'/resetDB',{}).then(function(){
        //         $http.get($rootScope.serverUrl+'/getVacantTables', {
        //                 params: {
        //                     library: $rootScope.selectedLib.name,
        //                     floor: $rootScope.selectedFloor.id,
        //                     room: $rootScope.selectedRoom.id
        //                 }
        //             })
        //             .then(function (response) {
        //                 $rootScope.vacantTables = response.data.tables;
        //                 $scope.init();
        //             })
        //     })
        // }
    })
    .directive('myTable', function ($rootScope) {

        return {
            restrict: 'A',
            scope: {
                reserveFunc: '=',
            },
            link: function (scope, element, attr) {
                var tableInfo = {
                    library: $rootScope.selectedLib.name,
                    floor: $rootScope.selectedFloor.id,
                    room: $rootScope.selectedRoom.id,
                    tableId: Number(attr.num)
                };
                element.on('click', function () {
                    scope.reserveFunc(tableInfo);
                })
            }
        }
    })