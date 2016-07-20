'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatappApp
 */
app.controller('MainCtrl',['$scope','$rootScope','$location','Pubnub',function ($scope,$rootScope,$location,Pubnub) {
     
    if(!$rootScope.initialized){
      $location.path("/join");  
    }
    
     
    $scope.controlChannel = "__controlchannel";
    $scope.channels = [];
    
    $scope.createChannel = function(){
        var channel = $scope.newChannel;
        
        $scope.newChannel= "";
        
        Pubnub.grant({
            channel: channel,
            message: 'Hello!',
            read: true,
            write: true,
            callback: function (m) {
               // $scope.channels = m;
              return console.log(m)
            }
        });
        
        Pubnub.grant({
            channel: channel,// + "-pnpres",
            presence: function(m){
                console.log(m)
            },
            read: true,
            write: false,
            callback: function (m) {
               return console.log(m)
            },
             triggerEvents: ['callback','presence']
        });
        
        
        console.log("PUBNUB publish");
        Pubnub.publish({
            channel: $scope.controlChannel,        
            message: channel,
            
            callback : function(m){
               return console.log(m)
            },
             triggerEvents: ['callback']
        });
        
        
        return setTimeout(function(){
            $scope.subscribe(channel);
            return $scope.showCreate = false;
        },100);
     }
     
     $scope.publish = function(){
          if(!$scope.selectedChannel){
            return;
        }
       
     
        Pubnub.publish({
                channel: $scope.selectedChannel,        
                message: {
                    text : $scope.newMessage,
                    user : $scope.data.username
                },
                callback : function(m){
                   return console.log(m);
                },
                triggerEvents: ['callback']
            });
        
        return $scope.newMessage = "";
     }
    
    
    $scope.subscribe = function(channel){
        var _ref;
        if(channel === $scope.selectedChannel){
            return;
        }
        
        if($scope.selectedChannel){
            Pubnub.unsubscribe({
                    channel : $scope.selectedChannel,
                });
        }
         
         $scope.selectedChannel = channel;
         $scope.messages = ["Welcome to " + channel];
        
        Pubnub.subscribe({
                channel:  $scope.selectedChannel,
                state : {
                    "city" : ((_ref = $rootScope.data) !=null ? _ref.city : void 0) || "unknown city"
                },
                 callback : function(m){
                   return console.log(m);
                },
                presence: function(m){
                   return console.log(m)
                },
//                message: function(m){
//                    console.log(m)
//                },
                error: function (error) {
                    // Handle error here
                    return console.log(JSON.stringify(error));
                },
                 triggerEvents: true
            });
             
             Pubnub.here_now({
                channel : $scope.selectedChannel,
                state: true,
               
                callback : function(m){
                    return console.log(m)
                },
                 triggerEvents: true
            })
            
            $rootScope.$on(Pubnub.getEventNameFor('here_now', 'callback'), function (ngEvent, payload) {
                  var $users = [];
                    $scope.$apply(function () {
                      //  $scope.statusSentSuccessfully = true;
                         angular.forEach(payload.uuids, function(value, key) {
                             $users.push(value.uuid.replace(/^.+__/,""));
                          });
                         $scope.users = $users;  
                    });
        });
            
            
            
            $rootScope.$on(Pubnub.getPresenceEventNameFor($scope.selectedChannel), function(event, payload, envelope, channel) {
             
                return $scope.$apply(function(){
                  
//                     var newData,userData;
//                   
//                        userData = Pubnub.getInstance($scope.selectedChannel);
//                            console.log(payload.uuid.replace(/\+w+__/,""));
//                            console.log(Pubnub);
//                            $scope.users = payload.uuid;
//                        newData = {};
//                        $scope.users = Pubnub.getInstance($scope.selectedChannel),function(x){
//                           
//                            var newX = x;
//                            if(x.replace){
//                                newX = x.replace(/\+w+__/,"");
//                            }
//                            if(x.uuid){
//                                 newX = x.uuid.replace(/\+w+__/,"")
//                            }
//                            newData[newX] = userData[x] || {};
//                            return newX;
//                        };
//                         console.log(newData);
//                        return $scope.userData = newData;
                    
                });
                       
            });
            
           
            
            $rootScope.$on(Pubnub.getMessageEventNameFor($scope.selectedChannel), function(event, payload) {
                // payload contains message, channel, env...
               
                 var msg = payload.user ? "[" + payload.user + "] " +  payload.text : "unknown";   
               
                return $scope.$apply(function(){
                    return $scope.messages.unshift(msg);
                });
            })
            
           return Pubnub.history({
                channel: $scope.selectedChannel,
                callback: function(history){
                  return console.log(history);//JSON.stringify(m)
                },
                count: 500, // 100 is the default
                reverse: false, // false is the default 
            });
     }
     
     
   
     
      Pubnub.subscribe({
           channel:  $scope.controlChannel,
//           message: 'Hello from the PubNub Javascript SDK!',
           callback : function(m){
               return console.log(m);
            },
           triggerEvents: ['callback']
      });
    
       $rootScope.$on(Pubnub.getMessageEventNameFor($scope.controlChannel), function(ngEvent, payload) {
                 return $scope.$apply(function(){
                    if($scope.channels.indexOf(payload) < 0){
                        return $scope.channels.push(payload);
                    }
                    
                });
      });
      
      Pubnub.history({
          channel: $scope.controlChannel,
          count: 500, 
            callback : function(m){
                    return console.log(m)
                },
                triggerEvents: ['callback']
      });
      
       $rootScope.$on(Pubnub.getEventNameFor('history', 'callback'), function (ngEvent, payload) {
                    console.log(payload);
                    var $channelArr = [];
                   return  $scope.$apply(function () {
                    angular.forEach(payload[0], function(value, key) {
                        if($.inArray(value, $channelArr) === -1) $channelArr.push(value);
                         
                    });
                    $scope.channels = $channelArr;
                  });
        });
      
      $scope.newChannel = "Waiting Room";
      return $scope.createChannel();
}]);
