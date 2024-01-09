/*! $FileVersion=1.1.409 */ var event_handler_fileVersion = "1.1.409"; 
if(typeof dataManipulator!=="object"){LoadScript("common.js")}function CreateEventHandler(){var c={handleEvent:function(g){try{var h=JSON.parse(g);var f=h.type;if(("MessageBusPlugin"==f)||("InProcAPI Plugin"==f)){this._processMsgBusEvent(h.payload)}else{if("UWP_Event"==f){this._processAnalyticsAddRecord_v1(h)}else{logWarning("Unexpected message was rejected (unknown type): "+g)}}}catch(i){logError("Failed to process incoming event: exception = '"+i.message+"'")}},handleV1Record:function(e){this._processAnalyticsAddRecord_v1(e)},_processMsgBusEvent:function(h){try{var f=h.name;var k=h.payload;if(("Analytics.v1.AddRecord"==f)||("Analytics.AddRecord"==f)||("Analytics.Automation.AddRecord"==f)){return this._processAnalyticsAddRecord_v1(k)}var j=ModuleManager.getSingleton("data_collector");j.notifyMsg(f);var g=ModuleManager.getSingleton("observation_analytics");g.handle(f,k)}catch(i){logError("Failed to process message-bus event: exception = '"+i.message+"'")}},_normalizePayload:function(l){if(!l){return null}var g={};try{for(var f in l){var j=l[f];if(j instanceof Array){g[f]=j}else{if(typeof j=="object"){for(var h in j){var k=j[h];g[h]=k}}else{g[f]=j}}}}catch(i){logError("Exception while normalizing payload: "+i.message)}return g},_processAnalyticsAddRecord_v1:function(n){try{logDebug("process Analytics.v1.AddRecord event: "+JSON.stringify(n));var m=n.unique_id;if(!m){m=n.UniqueIdentifier}var l=n.payload?this._normalizePayload(n.payload):this._normalizePayload(n.data);if(!l){logWarning("event '"+m+"': Unable to extract message payload; using an empty one");l={}}var h=n.type;if(h){l["Tracker.Type"]=h}if(l["Tracker.Type"]&&(typeof l["Tracker.Type"]=="string")){l["Tracker.Type"]=l["Tracker.Type"].toLowerCase()}if(l["__record.created"]==null){var i=new Date();l["__record.created"]=i.toISOString()}l.hit_event_id=m;logDebug("ready to transmit "+JSON.stringify(l));logRawTrack(m,JSON.stringify(l));var j=ModuleManager.getSingleton("config_manager");var f=j.getProfileNames(m);if(!f){logInformation("Rejected event '"+m+"': missing configuration");logAutomationError(m,JSON.stringify(l),JSON.stringify({level:"warning",type:{rejected:m+" is missing configuration/profile"}}));return}var g=ModuleManager.getSingleton("transport");g.transmit(m,l,f,j.getDataSetNames(m))}catch(k){logError("Failed to process Analytics.v1.AddRecord message: exception = '"+k.message+"'")}}};function b(){var e={_allEvents:[],_getData:function(f){try{return f.payload["payload"]["data"]}catch(g){logWarning("_getData: "+g.message);return null}},_setData:function(f,g){try{f.payload["payload"]["data"]=g}catch(h){logWarning("_setData: "+h.message)}},_getTime:function(f){try{var g=this._getData(f);if(typeof g[0]["__record.created"]=="string"){return{system:isoDateToDate(unescape(g[0]["__record.created"])),steady:parseInt(g[0]["__record.created.seconds"])}}return{system:g[0]["__record.created"],steady:g[0]["__record.created.seconds"]}}catch(h){logWarning("_getTime: "+h.message);return{system:null,steady:null}}},_setTime:function(f,i){try{var g=this._getData(f);g[0]["__record.created"]=i.system;g[0]["__record.created.seconds"]=i.steady}catch(h){logWarning("_setTime: "+h.message)}},_flattenEventsData:function(){for(var f=0;f<this._allEvents.length;f++){try{if(this._allEvents[f]["payload"]["name"]=="Analytics.AddRecord"){var k=this._getData(this._allEvents[f]);var j={};for(var h=0;h<k.length;h++){for(var g in k[h]){j[g]=k[h][g]}}this._setData(this._allEvents[f],[j])}}catch(l){logWarning("_flattenEventsData: "+l.message);this._setData(this._allEvents[f],k)}}},_findEarliestValidTime:function(){try{for(var f=0;f<this._allEvents.length;f++){var h=this._getTime(this._allEvents[f]);if(h){return{system:h.system,steady:h.steady}}}}catch(g){logWarning("_findEarliestValidTime: "+g.message)}return{system:new Date(),steady:0}},_convertQueue2Array:function(){var g=getDelayedRecordsQueue();while(false==g.IsEmpty()){try{var f=g.Front();g.Pop();this._allEvents.push(JSON.parse(f))}catch(h){logWarning("_convertQueue2Array (Creating array): "+h.message)}}},_appendMissingTime:function(){this._convertQueue2Array();this._flattenEventsData();for(var h=0;h<this._allEvents.length;h++){try{var k=this._getTime(this._allEvents[h]);if((h==0)&&!k.system&&(this._allEvents.length>1)){var m=this._findEarliestValidTime();this._setTime(this._allEvents[h],m)}else{if((h==(this._allEvents.length-1))&&!k.system&&(this._allEvents.length>1)){var f=this._getTime(this._allEvents[h-1]);this._setTime(this._allEvents[h],f)}else{if((h>0)&&!k.system&&h<(this._allEvents.length-1)){var l=this._getTime(this._allEvents[h-1]);var g=this._getTime(this._allEvents[h+1]);if(!l.system){this._setTime(this._allEvents[h],g)}else{if(!g.system){this._setTime(this._allEvents[h],l)}else{var n=new Date((l.system.getTime()+g.system.getTime())/2);var j=(l.steady+g.steady)/2;this._setTime(this._allEvents[h],{system:n,steady:j})}}}else{this._setTime(this._allEvents[h],k)}}}}catch(i){logWarning("_appendMissingTime: "+i.message);this._setTime(this._allEvents[h],{system:null,steady:0})}}},checkTimeTravel:function(){try{var p=60;var j=false;this._appendMissingTime();for(var l=0;l<this._allEvents.length;l++){try{var g=this._getTime(this._allEvents[l]);if(l==(this._allEvents.length-1)){continue}else{var i=this._getTime(this._allEvents[l+1])}if(!g.system||!i.system){continue}var k=(i.system-g.system)/1000;var o=(i.steady-g.steady);var n=Math.abs(k-o);if(n>p||k<0){j=true;break}}catch(m){logWarning("checkTimeTravel : "+m.message)}}var f=getPluginFactory().Create("queue");if(j){logWarning("checkTimeTravel: Using current datetime for events, due to inconsistency")}for(var l=0;l<this._allEvents.length;l++){try{var h=this._getTime(this._allEvents[l]);if(j){h={system:new Date(),steady:0}}this._setTime(this._allEvents[l],{system:h.system,steady:String(h.steady)})}catch(m){logWarning("checkTimeTravel (Converting time to ISO format): "+m.message);this._setTime(this._allEvents[l],{system:null,steady:0})}f.Push(JSON.stringify(this._allEvents[l]))}getScriptVariableStore().Set("delayedQueue",f)}catch(m){logError("Error in checkTimeTravel: "+m.message)}}};return e}try{MessageBusHandler=function(e){logInformation("Handling a new event: "+e);c.handleEvent(e)}}catch(d){logError("MessageBusHandler redefinition problem: e = "+d.message)}var a=function(){try{b().checkTimeTravel();var h=getDelayedRecordsQueue();while(false==h.IsEmpty()){var f=h.Front();h.Pop();try{c.handleEvent(f)}catch(g){logError("Error handling record "+f+". Error Msg: "+g.message)}}}catch(g){logError("An exception occured while processing the queued events pre engine.js: "+g.message)}};a();return c}ModuleManager.registerFactory("event_handler",CreateEventHandler);
//8C4CA16A260B1FCE056E6CB7C88BC862E4474CFE376C4EE8315D85350DD866B6A4B0321553F4C944146180E118F7583D89B1D7AAA0B30AA5ED34922FD06EC0C8++