/*! $FileVersion=1.1.409 */ var transport_msgbus_fileVersion = "1.1.409"; 
function MsgBusTransport(){this._msgbus=null;this._msgName=null;this._processorName=null;this._processorConfig=null;this._processors=(function(a){a.logInfo("Creating processors");return{noop:function(c,b){a.logInfo("noop: Returning eventDataObj unmodified");return c},simpleMsgComposer:function(c,b){a.logInfo("simpleMsgComposer: Creating new message");var f={};for(var d in b){if(b.hasOwnProperty(d)){var e=b[d];if(e.startsWith("$")){e=c[e.substring(1)]}a.logInfo("simpleMsgComposer: Adding new key-vaule to message: "+d+" = "+e);f[d]=e}}return f},passthroughComposer:function(c,b){a.logInfo("datasetComposer: Creating new message");var f={};var e=b.filteredKeys;if(!e){e=[]}for(var d in c){if(e.indexOf(d)>=0){continue}f[d]=c[d]}return f}}})(this);this.logInfo("New MsgBusTransport Created")}MsgBusTransport.prototype=ModuleManager.create("transport_template");MsgBusTransport.prototype.constructor=MsgBusTransport;MsgBusTransport.prototype.logInfo=function(a){logInformation("MsgBusTransport: "+a)};MsgBusTransport.prototype.logError=function(a){logError("MsgBusTransport: "+a)};MsgBusTransport.prototype.logWarning=function(a){logWarning("MsgBusTransport: "+a)};MsgBusTransport.prototype.GetVersion=function(){try{return engine.getContentVersion()}catch(a){}};MsgBusTransport.prototype._setup=function(){try{this._msgbus=getMessageBus();if(!this._msgbus){this.logError("_setup: Messagebus Plugin is not available");return false}this._msgName=this._config.msgName;if(!this._msgName){this.logError("_setup: msgName is null");return false}this._processorName=this._config.processorName;if(!this._processorName){this._processorName="noop"}if(!this._processors[this._processorName]){this.logError("_setup: Unknown processor - "+this._processorName);return false}this._processorConfig=this._config.processorConfig;if(!this._processorConfig){this._processorConfig={}}this.logInfo("Initialized successfully");return true}catch(a){this.logError("_setup: Exception caught with message "+a.message);return false}};MsgBusTransport.prototype.Uninitialize=function(){this._msgbus=null;this._msgName=null;this._processorName=null;this._processorConfig=null;this.logInfo("Uninitialized successfully")};MsgBusTransport.prototype.Send=function(g){try{if(!this._msgbus||!this._msgName){this.logError("Send Attempting to send without initializing");return false}if(!this._msgbus.IsAvailable()){this.logWarning("Send: Message Bus could not be loaded");return false}var c=false;var a=JSON.parse(g);var b=this._processors[this._processorName](a,this._processorConfig);var h=JSON.stringify(b);try{this._msgbus.Publish(this._msgName,h);c=true;this.logInfo("Send: Transmitted '"+this._msgName+"' successfully")}catch(f){this.logError("Send: Failed to send data: exception is '"+f.message+"'")}var d=a.hit_event_id;logTransports(d,this.GetName()+"_"+this._msgName,c,h);return c}catch(f){this.logError("Send: Failed to send data: "+f.message);return false}};ModuleManager.registerFactory("transport_msgbus",MsgBusTransport);
//1A9AB311626F0FF7558B2E09D127EC647ED87A931F2057CB97973B5763A0BB70D92117663027A4D216C1EC2D6B063BCFFD8CF5402DB410030052AC99E1A8C1E4++