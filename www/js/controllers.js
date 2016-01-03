angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, AllJoynService, $ionicPlatform, $cordovaDevice) {
    $scope.device;
    $scope.transmit = false;
    $scope.busInfo;

    $scope.deviceStatus;

    //order checking semaphores
    var connected = false;
    var announced = false;
    window.localStorage['appUUID'] = 'b2549b67-4e96-4aca-b7de-aacda220b3e8';
    console.log('DashCtrl');

    console.log('Cordova Device info: ');
    console.log($cordovaDevice.getDevice());
    $scope.device = $cordovaDevice.getDevice();
    window.localStorage['device'] = JSON.stringify($scope.device);
    window.localStorage['curPort'] = 1;

    $scope.connectToBus = function() {
        console.log('Connecting to Bus');
        $scope.deviceStatus = 'Attempting bus connect';
        $ionicPlatform.ready(function() {
            $scope.connected = true;
            $scope.bus = AllJoynService.busConnect().then(function() {
                $scope.deviceStatus = 'Bus connect successful';
                connected = true;
            }, function() {
                $scope.deviceStatus = 'Failed to connect to bus';
                console.log('Connect failed. Returned.');
            });
        });
    };


    $scope.announce = function() {
        console.log('Announce selected');
        if (!connected) {
            console.log('');
            return;
        }
        $ionicPlatform.ready(function() {
            $scope.deviceStatus = 'Attempting announce.';
            //register objects, then announce with the signal

            console.log(AllJoynService);
            AllJoynService.register().then(function(data) {
                console.log('Controller register success callback');
                //register success
                $scope.deviceStatus = 'Objects registered successfully';
                //call announce
                console.log('Checking bus stored object');
                console.log(JSON.parse(window.localStorage['curBus'] || {}));
                AllJoynService.announce().then(function() {
                    console.log('Announce success controller callback');
                    //announce success 
                    $scope.deviceStatus = 'Announce Successful';
                    announced = true;
                }, function() {
                    console.log('Announce failure controller callback');
                });

            }, function(data) {
                console.log('Controller register failure callback');
            });


        });
    };



    $scope.transmitToggle = function() {
        console.log($scope.transmit);
    };

    if ($scope.transmit) {
        console.log('Hi');
    }

});
