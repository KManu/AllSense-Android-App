var broadcastOnRootScope = function() {
    var broadcastArguments = arguments;
    var $rootScope = angular.element(document.body).scope().$root;
    // Prevent error by checking what phase $apply is in before calling it.
    // Approach taken from:
    // https://coderwall.com/p/ngisma/safe-apply-in-angular-js
    var phase = $rootScope.$$phase;
    if (phase == '$apply' || phase == '$digest') {
        $rootScope.$broadcast.apply($rootScope, broadcastArguments);
    } else {
        $rootScope.$apply(function() {
            $rootScope.$broadcast.apply($rootScope, broadcastArguments);
        });
    }
}

angular.module('starter.services', [])

.factory('AllJoynService', function($q) {
    // Might use a resource here that returns a JSON array

    var curBus = null;


    return {

        busConnect: function() {
            var advertiseNameSuccess = function() {
                console.log('Advertise Successfull');
            };

            var advertiseNameFailure = function() {
                console.log('Advertise Failed');
            };
            var deferred = $q.defer();
            if (window.AllJoyn) {
                AllJoyn.connect(function(bus) {
                    chatBus = bus;
                    console.log('Found bus and connected.');
                    //set port and name
                    var name = 'Sensor ' + JSON.parse(window.localStorage['device'] || '{}').uuid;
                    var port = JSON.parse(window.localStorage['curPort'] || '{}');
                    var carBus;
                    console.log("Successfully connected to the AllJoyn bus!");
                    //Join a session, register objects, add listeners, etc...
                    curBus = bus;
                    console.log('Cur Bus:');
                    console.log(curBus);
                    console.log(name);
                    console.log(port);
                    curBus.startAdvertisingName(advertiseNameSuccess, advertiseNameFailure, name, port);

                    var interfaceNames = ['org.alljoyn.About'];
                    curBus.addInterfacesListener(interfaceNames, function(announceData) {
                        console.log(announceData || {});
                        console.log('Back from interface');
                    });

                    window.localStorage['curBus'] = JSON.stringify(bus);

                    deferred.resolve();

                }, function(status) {
                    console.log('Could not connect to the bus. Make sure your network has an AllJoyn router running and accessible to this application.');
                    console.log(status);
                    deferred.reject();
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
            // //





        },
        busAdvertise: function() {

        }
    };
});
