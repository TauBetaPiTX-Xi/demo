/*! $FileVersion=1.1.409 */ var observation_analytics_fileVersion = "1.1.409"; 
function getObservationAnalyticsEngine(){
/*
     *  config format:
     *   'Message.Name' : {                 // name of obsved message on messagebus that we will subscribe to
     *       'map' : {                      // map from message keys --> analytic friendly keys
     *           'Count' : 'Metric1',       // ex. 'Count' : 123  --> 'Metric1' : 123
     *           'Policy' : 'Event.Label'   // ex. 'Policy' : 'XYZ' --> 'Event.Label' : 'XYZ'
     *       },
     *       'default' : {                  // default values that are not specified in the obsved message
     *           'hit_event_id' : 'XYZ'
     *       }
     *   }
     */
var a={"Testing.Mock":{map:{Success:"Received"},"default":{"Test.Value":"Yes"}},"WSSAlertPlugin.L3.AlertSuppressed":{map:{AlertID:"Event.Label",isSuppressedByL3Policy:"Hit.Result"},"default":{hit_event_id:"WSSAlertPlugin.L3.AlertSuppressed","Event.Category":"Alerts","Event.Action":"L3 Alert was suppressed","Hit.Interactive":true,"Hit.User.Initiated":true}},"AntiSpam.Mails.ScannedInDay":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.ScannedInDay","Event.Category":"Anti-Spam","Event.Action":"Mails Scanned","Event.Label":"Mails Scanned","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.SpamCntInDay":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.SpamCntInDay","Event.Category":"Anti-Spam","Event.Action":"Spam Mails","Event.Label":"Filtered Spam Mails","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.AllowedBy2Big":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.AllowedBy2Big","Event.Category":"Anti-Spam","Event.Action":"2Big","Event.Label":"Allowed Mails Too Big","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.AllowedByFriend":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.AllowedByFriend","Event.Category":"Anti-Spam","Event.Action":"Friend","Event.Label":"Allowed Mails Friend","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.BlockedByCustomFilter":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.BlockedByCustomFilter","Event.Category":"Anti-Spam","Event.Action":"CustomFilter","Event.Label":"Blocked Mails on Custom Filter","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.BlockedByHydraScore":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.BlockedByHydraScore","Event.Category":"Anti-Spam","Event.Action":"HydraScore","Event.Label":"Blocked Mails on Hydra Score","Hit.Interactive":false,"Hit.User.Initiated":false}},"AntiSpam.Mails.BlockedByNotAFriend":{map:{Count:"Event.Value"},"default":{hit_event_id:"AntiSpam.Mails.BlockedByNotAFriend","Event.Category":"Anti-Spam","Event.Action":"NotAFriend","Event.Label":"Blocked Mails on NotAFriend","Hit.Interactive":false,"Hit.User.Initiated":false}},"Core.AntiSpam.Settings":{map:{state:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.Settings","Event.Category":"Anti-Spam","Event.Action":"Changed AntiSpam setting state","Hit.Interactive":false,"Hit.User.Initiated":true}},"Core.AntiSpam.ProtectionLevel":{map:{level:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.ProtectionLevel","Event.Category":"Anti-Spam","Event.Action":"Set Spam Protection Level","Hit.Interactive":false,"Hit.User.Initiated":false}},"Core.AntiSpam.ProtectionLevelChanged":{map:{level:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.ProtectionLevel","Event.Category":"Anti-Spam","Event.Action":"Change Protection Level","Hit.Interactive":false,"Hit.User.Initiated":false}},"Core.AntiSpam.AddFilteringRule":{map:{acounttype:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.AddFilteringRule","Event.Category":"Anti-Spam","Event.Action":"Web-Mail accounts Added","Hit.Interactive":false,"Hit.User.Initiated":true}},"Core.AntiSpam.FilteringRuleState":{map:{acounttype:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.FilteringRuleState","Event.Category":"Anti-Spam","Event.Action":"Viewed Filtered Web Mails","Hit.Interactive":false,"Hit.User.Initiated":true}},"AntiSpam.User.LastSpamMailSize":{map:{Size:"Event.Value"},"default":{hit_event_id:"AntiSpam.User.LastSpamMailSize","Event.Category":"Anti-Spam","Event.Action":"Spam Mail Size","Event.Label":"Spam Mail Size","Hit.Interactive":false,"Hit.User.Initiated":true}},"AntiSpam.User.MarkAsSpam":{map:{Source:"Event.Label"},"default":{hit_event_id:"AntiSpam.User.MarkAsSpam","Event.Category":"Anti-Spam","Event.Action":"Mark As Spam","Hit.Interactive":false,"Hit.User.Initiated":true}},"AntiSpam.User.MarkAsHam":{map:{Source:"Event.Label"},"default":{hit_event_id:"AntiSpam.User.MarkAsHam","Event.Category":"Anti-Spam","Event.Action":"Mark As Ham","Hit.Interactive":false,"Hit.User.Initiated":true}},"Core.AntiSpam.AddRule":{map:{field:"Hit.Label.1",action:"Event.Label",phrase:"Hit.Label.2"},"default":{hit_event_id:"Core.AntiSpam.AddRule","Event.Category":"Anti-Spam","Event.Action":"Add Custom Filter rules","Hit.Interactive":false,"Hit.User.Initiated":true}},"Core.AntiSpam.EmailProcessing":{map:{markedemail:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.EmailProcessing","Event.Category":"Anti-Spam","Event.Action":"Leave Spam Mails in Inbox","Hit.Interactive":false,"Hit.User.Initiated":true}},"Core.AntiSpam.Toolbar":{map:{toolbars:"Event.Label"},"default":{hit_event_id:"Core.AntiSpam.Toolbar","Event.Category":"Anti-Spam","Event.Action":"Disable Anti-Spam Tool Bar","Hit.Interactive":false,"Hit.User.Initiated":true}},analytics_dataset_get:{map:{},"default":{hit_event_id:"analytics_send_splitio_product_attributes"}}};var b={start:function(){try{var c=getMessageBus();for(var d in a){c.Subscribe(d)}logDebug("observationEngine Started")}catch(f){logError("observationEngine.start(): "+f.message)}},handle:function(g,j){try{logDebug("observationEngine.handle() Received "+g+" : "+JSON.stringify(j));var c=a[g];if(!c){logDebug("observationEngine.handle() Received an unknown event: "+g);return}var d=c.map;var f=c["default"];var h={UniqueIdentifier:f.hit_event_id,type:"event",payload:{"Tracker.Type":"event"}};for(var k in d){if(!(k in j)){logWarning("observationEngine.handle() Dropping event "+g+" expecting key: "+k);return}h.payload[d[k]]=j[k]}for(var k in f){if(!(k in h.payload)){h.payload[k]=f[k]}}logDebug("observationEngine.handle() Sending to transport: "+JSON.stringify(h));var l=ModuleManager.getSingleton("event_handler");l.handleV1Record(h)}catch(i){logError("observationEngine.handle() Failed to handle message on message bus: "+i.message)}}};return b}ModuleManager.registerFactory("observation_analytics",getObservationAnalyticsEngine);
//D0C804CA6EDFCE09B8B1049E32AE4DDD869D57A1B8B42598D3695BE2DBEE799D467FF99303C4ABAADD53F46880AFBD436054EA006EF933FD377045A73A6CD30C++