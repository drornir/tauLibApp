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
            var username = $scope.tauUsername;
            $http.get($rootScope.serverUrl + '/user/' + username, {})
                .then(function (response) {
                    if (response.data.user == null) {
                        $rootScope.errorMsg = "Error: unrecognized user";
                    } else {
                        $rootScope.tauUserId = response.data.user._id;
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
                    $rootScope.errorMsg = "Unexpected Error: " + JSON.stringify(error);
                    $state.reload($state.current);
                });
        }
    })
    .controller('reservation', function ($scope, $http, $rootScope, $state) {
        // document.getElementById('reservedTable').value = JSON.stringify($rootScope.reservedTable);
        $scope.init = function () {
            $scope.reservedTable = $rootScope.reservedTable;
        };
        $scope.cancelReservation = function () {
            $http.post($rootScope.serverUrl + '/user/' + $rootScope.tauUserId + '/cancel_reservation', {})
                .then(function (response) {
                    $state.go('filter');
                })
                .catch(function (error) {
                    $rootScope.errorMsg = "Error: " + JSON.stringify(error);
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
                        id: "F1",
                        rooms: [
                            {
                                id: "R1"
                            },
                            {
                                id: "R2"
                            },
                            {
                                id: "R3"
                            },
                            {
                                id: "R4"
                            }
                        ]
                    },
                    {
                        id: "F2",
                        rooms: [
                            {
                                id: "R1"
                            },
                            {
                                id: "R2"
                            },
                            {
                                id: "R3"
                            }
                        ]
                    }
                ]
            },
            {
                displayName: "ספריית מדעי החברה",
                name: "L1",
                floors: [
                    {
                        id: "F1",
                        rooms: [
                            {
                                id: "R1"
                            },
                            {
                                id: "R2"
                            },
                            {
                                id: "R3"
                            }
                        ]
                    },
                    {
                        id: "F2",
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
            }
        ]
        $scope.initFilterRooms = function () {
            $scope.selectedLib = undefined;
            $scope.selectedFloor = undefined;
            $scope.selectedRoom = undefined;
        }
        $scope.send = function () {

            $http.get($rootScope.serverUrl + '/table/vacant', {
                    params: {
                        library: $scope.selectedLib.name,
                        floor: $scope.selectedFloor.id,
                        room: $scope.selectedRoom.id
                    }
                })
                .then(function (response) {
                    $rootScope.vacantTables = response.data;
                    $rootScope.selectedLib = $scope.selectedLib;
                    $rootScope.selectedFloor = $scope.selectedFloor;
                    $rootScope.selectedRoom = $scope.selectedRoom;
                    $state.go('room');
                })
                .catch(function (error) {
                    $rootScope.errorMsg = "Error: " + JSON.stringify(error);
                    $state.go('login');
                });
        }

    })
    .controller('room', function ($scope, $http, $rootScope, $state) {
        $rootScope.showBackButton = true;
        $scope.$on('$destroy', function () {
            $rootScope.showBackButton = false;
        });
        $scope.init = function () {
            $scope.available = {};
            $scope.tablesMap = {};
            $rootScope.vacantTables.forEach(function (table) {
                $scope.tablesMap[table.number] = table;
                $scope.available[table.number] = true;
            })
        };

        $scope.reserveTable = function (tableInfo) {
            $http.put($rootScope.serverUrl + "/table/" + tableInfo._id + '/reserve/' + $rootScope.tauUserId, {})
                .then(function (response) {
                    console.log(response.data);
                    return $http.get($rootScope.serverUrl + '/table/vacant', {
                            params: {
                                library: $rootScope.selectedLib.name,
                                floor: $rootScope.selectedFloor.id,
                                room: $rootScope.selectedRoom.id
                            }
                        })
                        .then(function (response) {
                            $rootScope.vacantTables = response.data;
                            $scope.init();
                        })

                })
                .catch(function (error) {
                    $rootScope.errorMsg = "Error: " + JSON.stringify(error);
                    $state.go('login');
                });
        }
    })