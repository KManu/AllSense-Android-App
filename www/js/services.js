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
    var device = JSON.parse(window.localStorage['device'] || {});
    //set port and name
    var name = 'Sensor ' + device.uuid || {};
    var port = JSON.parse(window.localStorage['curPort'] || '{}');
    var curBus = {};
    //General interface definitions

    //interfaces
    var AboutInterface = [
        'org.allseen.About',
        '?GetAboutData languageTag<s AboutData>a{sv}',
        '!Announce >q >q >a(oas) >a{sv}',
        '@AppId >ay',
        '@DefaultLanguage >s',
        '@DeviceName >s',
        '@DeviceId >s',
        '@AppName >s',
        '@Manufacturer >s',
        '@ModelNumber >s',
        '@SupportedLanguages >as',
        '@Description >s',
        '@SoftwareVersion >s',
        '@AJSoftwareVersion >s',
        null
    ];




    var NotificationInterface = [
        'org.alljoyn.Notification',
        '!notify >q >i >q >s >s >ay >s >a{iv} >a{ss} >a(ss)',
        '@Version >q',
        null
    ];

    var service = {
        register: register,
        announce: announce,
        busConnect: busConnect,
    };

    return service;

    ////////////////////
    ///
    function register() {
        var deferred = $q.defer();
        console.log('Hello from register');
        //Define objects
        var appObjects = [{
            path: '/AllSense',
            interfaces: [
                AboutInterface,
                NotificationInterface,
                null
            ]
        }, null];

        var proxyObjects = null;

        //register objects
        AllJoyn.registerObjects(function() {
            //success callback
            console.log('Object Register successful.');
            deferred.resolve();
        }, function() {
            //failure callback
            console.log('Object register failed.');
            deferred.reject();
        }, appObjects, proxyObjects);

        return deferred.promise;

    };

    function announce() {
        var deferred = $q.defer();
        //Start sessionless about announcement signal
        console.log('Inside About announcement');
        console.log(curBus);
        var aboutIndexList = [1, 0, 0, 1];
        var aboutInParameterType = 'qqaa(oas)a{sv}';
        var aboutParameters = [
            1, //q Version number of the About interface.
            port, //q Session port the app will listen on incoming sessions.
            ['/AllSense', ['AboutInterface', 'NotificationInterface']], //a(oas) Array of object paths and the list of supported interfaces provided by each object.
            [
                ['AppId', window.localStorage['appUUID']],
                ['DefaultLanguage', 'en'],
                ['DeviceName', device.model],
                ['DeviceId', device.uuid],
                ['AppName', 'AllSense'],
                ['Manufacturer', device.manufacturer],
                ['ModelNumber', device.serial]
            ] //a{sv} All the fields listed in About data interface fields with a yes value in the Announced column are provided in this signal.
        ];

        console.log(aboutParameters);

        //Sending about signal
        console.log('Bef');
        curBus.sendSignal(function() {
            //success callback
            console.log('Signal sending successful');
            deferred.resolve();
            angular.element(document.body).scope().$apply();
        }, function() {
            //failure callback
            console.log('signal sending failed');
            deferred.reject();
            angular.element(document.body).scope().$apply();
        }, aboutIndexList, aboutInParameterType, aboutParameters);
        console.log('Aft');
        return deferred.promise;
    };


    function busConnect() {


        var deferred = $q.defer();
        var device = null;
        if (window.AllJoyn) {
            console.log('Alljoyn object');
            console.log(window.AllJoyn);
            AllJoyn.connect(function(bus) {

                //Bus connection successful callback 
                console.log('Found bus and connected.');
                device = JSON.parse(window.localStorage['device'] || '{}');

                var carBus;
                console.log("Successfully connected to the AllJoyn bus!");
                curBus = bus;
                console.log('Cur Bus:');

                console.log(curBus);
                window.localStorage['curBus'] = JSON.stringify(curBus);
                console.log('Bus stored: ');
                console.log(window.localStorage['curBus']);
                //Join a session, register objects, add listeners, etc...
                /*register().then();
                announce(curBus);*/

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
    };



});
