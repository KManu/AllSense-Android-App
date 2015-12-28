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
            //General callback and interface definitions

            //callbacks
            var advertiseNameSuccess = function() {
                console.log('Advertise Successfull');
            };

            var advertiseNameFailure = function() {
                console.log('Advertise Failed');
            };

            var sendAnnounceSuccess = function() {
                console.log('About announcement successful');
            };

            var sendAnnounceFailure = function() {
                console.log('About announce failed');
            };
            var registerSuccess = function() {
                console.log('Register Successfull');
            };
            var registerFailure = function() {
                console.log('Register Failed');
            };

            //interfaces
            var AboutInterface = [
                'org.allseen.About',
                '?GetAboutData languageTag<s AboutData>a{sv}',
                '!Announce >q >q >a(oas) >a{sv}',
                '@AppId >ay'
                '@DefaultLanguage >s',
                'DeviceName >s',
                'DeviceId >s',
                'AppName >s',
                'Manufacturer >s',
                'ModelNumber >s',
                'SupportedLanguages >as',
                'Description >s',
                'SoftwareVersion >s',
                'AJSoftwareVersion >s',
                null
            ];


            var NotificationInterface = [
                'org.alljoyn.Notification',
                '!notify >q >i >q >s >s >ay >s >a{iv} >a{ss} >a(ss)',
                '@Version >q',
                null
            ];

            var deferred = $q.defer();
            if (window.AllJoyn) {

                AllJoyn.connect(function(bus) {
                    //Bus connection successful callback 
                    console.log('Found bus and connected.');
                    //set port and name
                    var name = 'Sensor ' + JSON.parse(window.localStorage['device'] || '{}').uuid;
                    var port = JSON.parse(window.localStorage['curPort'] || '{}');
                    var carBus;
                    console.log("Successfully connected to the AllJoyn bus!");
                    curBus = bus;
                    console.log('Cur Bus:');
                    console.log(curBus);
                    //Join a session, register objects, add listeners, etc...
                    //Define and register objects
                    var appObjects = [{
                        path: 'com/manu/appObject',
                        interfaces: [
                            AboutInterface,
                            NotificationInterface,
                            null
                        ]
                    }, null];
                    var proxyObjects = null;
                    Alljoyn.registerObjects(registerSuccess, registerFailure, appObjects, proxyObjects);


                    //Start sessionless about announcement signal
                    var aboutIndexList = [1, 0, 0, 1];
                    var aboutInParameterType = 'qqaa(oas)a{sv}';
                    var aboutParameters = [
                        //q Version number of the About interface.
                        port,//q Session port the app will listen on incoming sessions.
                        [],//a(oas) Array of object paths and the list of supported interfaces provided by each object.
                        [
                            [],
                            [],
                        ]//a{sv} All the fields listed in About data interface fields with a yes value in the Announced column are provided in this signal.
                    ];
                    //Sending about signal
                    carBus.sendSignal(sendAnnounceSuccess, sendAnnounceFailure, aboutIndexList, aboutInParameterType, aboutParameters);

                    console.log(name);
                    console.log(port);
                    curBus.startAdvertisingName(advertiseNameSuccess, advertiseNameFailure, name, port);

                    var interfaceNames = ['org.alljoyn.About'];
                    curBus.addInterfacesListener(interfaceNames, function(announceData) {
                        console.log('Announce Data: ');
                        console.log(announceData || {});
                        window.localStorage['announceData'] = JSON.stringify(announce);
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
