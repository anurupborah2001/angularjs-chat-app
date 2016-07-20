'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the chatappApp
 */

app.controller('JoinCtrl',['$scope','$rootScope','$location','Pubnub',function($scope,$rootScope,$location,Pubnub) {
          
        $scope.data = {
            username : 'User_' + Math.floor(Math.random() * 1000)
        };
        
       
        
        $scope.join = function(){ 
            console.log("Joining"); 
            var _ref,$ref1;
            $rootScope.data || ($rootScope.data = {});
            $rootScope.data.username = (_ref = $scope.data) !==null ? _ref.username : void 0 ;
            $rootScope.data.city = ($ref1 = $scope.data) !==null ? $ref1.city : void 0 ;
            $rootScope.data.uuid =  Math.floor(Math.random() * 100000) + "__" + $scope.data.username;
            
            if (!$rootScope.initialized) {
                    Pubnub.init({
                        publish_key: 'pub-c-8eade5f5-0f03-4a8d-8f28-71300e1c5d53',
                        subscribe_key: 'sub-c-508c416e-4a3c-11e6-a1d5-0619f8945a4f',
                        secret_key: 'sec-c-Zjc3ZDViYzItYWEyMy00ZjU4LWJhNzMtMmMzM2E5ZGZmNWVi',
                        uuid: $rootScope.data.uuid
                    });
                    $rootScope.initialized = true;
            }
            
            console.log("PUBNUB inited");
            return $location.path("/main");
        }
  }]);
