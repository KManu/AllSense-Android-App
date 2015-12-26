angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, AllJoynService, $ionicPlatform, $cordovaDevice) {
    $scope.device;
    $scope.status;
    $scope.router;
    $scope.transmit = false;
    $scope.bus;
    $scope.connected = false;
    console.log('DashCtrl');

    console.log('Cordova Device info: ');
    console.log($cordovaDevice.getDevice());
    $scope.device = $cordovaDevice.getDevice();
    window.localStorage['device'] = JSON.stringify($scope.device);
    window.localStorage['curPort'] = 1;

    //Display the conenction details in the status 
    $scope.announce = function() {
        console.log('Announce selected');
        $ionicPlatform.ready(function() {
            $scope.connected = true;
            $scope.bus = AllJoynService.busConnect().then(function() {
                /*console.log(JSON.parse(window.localStorage['curBus'] || '{}'));*/
                $scope.bus = JSON.parse(window.localStorage['curBus'] || '{}');
            }, function() {
                console.log('Connect failed. Returned.');
            });

        });

    };
    $scope.connectToggle = function() {
        AllJoynService.busConnect();
        console.log('Connect/Reconnect');
    };
    $scope.transmitToggle = function() {
        console.log($scope.transmit);
    };

    if ($scope.transmit) {
        console.log('Hi');
    }

})


.controller('AboutCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
