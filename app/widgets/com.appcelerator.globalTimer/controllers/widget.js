//Create local variables
var _args = arguments[0] || {},
	intervalId = null,
	recording = false,
	elapsed = 0,
	aid = null;
	
//Create global data object for startTime and duration
if(!Alloy.Globals.Timer){
	Alloy.Globals.Timer = {
		totalDuration : null,
		startTime : null,
		running : false
	}
}

//Scale the timer display
_args.scale && $.widget.applyProperties({
	transform: Ti.UI.create2DMatrix().scale(_args.scale)
});

_.extend($.widget, _args);

$.setAid = function(_data){
	aid = _data;
	init();
}

$.updateTimer = function(noUpdate){
	if(aid == Alloy.Globals.activeAid && Alloy.Globals.Timer.running){
		//If there is a startTime subtract it from the current time, otherwise set local time to 0
	 	var _localTime = (Alloy.Globals.Timer.startTime && !noUpdate)?Math.floor((new Date().getTime() - Alloy.Globals.Timer.startTime)/1000):0
		
		//Update elapsed time to the global total duration plus the updated localTime (usually 1 second)
		elapsed = Alloy.Globals.Timer.totalDuration + _localTime;
		
	  	$.time.text = formatTime(elapsed);
	  	return $.time.text;
 } else if(aid == Alloy.Globals.activeAid){
 	$.stop();
 } 
  	
}

//Start the local timer
$.start = function(){
	if(recording == false && aid == Alloy.Globals.activeAid){
		Alloy.Globals.Timer.running = true;
		if(Alloy.Globals.Timer.startTime  == null){
			Alloy.Globals.Timer.startTime =  new Date().getTime();
		} 
		
		intervalId = setInterval($.updateTimer, 1000);
		
		$.btnPlayPause.backgroundImage = "/my-service-outlets/task-pause-btn.png";
		$.btnPlayPause.backgroundSelectedImage = "/my-service-outlets/task-pause-btn-touch.png";
		
		recording = true;
		
	} else if(aid != Alloy.Globals.activeAid){
		var alertDialog = Ti.UI.createAlertDialog({
			title:"Set as Active Assignment?",
			message:"To track time, this assignment must be the active assignment.",
			buttonNames:["Set Active","Cancel"]
		});
		alertDialog.show();
		
		alertDialog.addEventListener("click", function(e){
			if(e.index == 0){
				Alloy.Globals.MyOutlets.activeClick({aid:aid, callback:$.start});
			}
		});
		
	}
};

//Stop the local timer
$.stop = function(){
	if(recording!=false && aid == Alloy.Globals.activeAid){
		Alloy.Globals.Timer.running = false;
		Alloy.Globals.Timer.totalDuration = elapsed;
		Alloy.Globals.Timer.startTime = null;
		
		intervalId && clearInterval(intervalId);
		
		$.btnPlayPause.backgroundImage = "/my-service-outlets/task-play-btn.png";
		$.btnPlayPause.backgroundSelectedImage = "/my-service-outlets/task-play-btn-touch.png";
		
		recording = false;
		intervalId = null;

	} 
	
	$.time.text = formatTime(Alloy.Globals.Timer.totalDuration);
};

//Stop and reset global timer
$.reset = function(){

	intervalId && clearInterval(intervalId);
	
	intervalId = null;
	recording = false;
	elapsed = 0;

	$.time.text = "00:00:00";
	
	if(aid == Alloy.Globals.activeAid){
		Alloy.Globals.Timer.running = false;
		Alloy.Globals.Timer.totalDuration = 0;
		Alloy.Globals.Timer.startTime = null;
	}

};

$.getTime = function(){
	return $.updateTimer(true);
}

$.setTime = function(_time) {
	Alloy.Globals.Timer.totalDuration = _time;
	$.updateTimer(true);
}

$.checkStatus = function(){
	if(aid == Alloy.Globals.activeAid && recording != Alloy.Globals.Timer.running){
		$.start();
	}
}
$.hide = function(){
	$.widget.hide();
}
function formatTime(_time){
	var _remainingTime = 0,
 		_hours = 0,
 		_minutes = 0,
 		_seconds = 0;
 		
    _hours = Math.floor(_time/ 3600);
	_remainingTime = _time % 3600;
	_minutes = Math.floor(_remainingTime / 60);
	_remainingTime = _remainingTime % 60;
	_seconds = Math.floor(_remainingTime);

	function time_string(sTime) {
    	return ( sTime < 10 ? "0" : "" ) + sTime;
  	}

  	_hours = time_string(_hours);
  	_minutes = time_string(_minutes);
  	_seconds = time_string(_seconds);
  	return "" + _hours + ":" + _minutes + ":" + _seconds;
}

function togglePlayPause(){
	recording?$.stop():$.start();
}

function init(){
	//If totalDuration == null then set it to 0 and set the timer to 0, otherwise update the timer value
	if(Alloy.Globals.activeAid != aid){
		$.time.text = "00:00:00";
	} else {
		if(Alloy.Globals.Timer.totalDuration == null){
			Alloy.Globals.Timer.totalDuration = 0;
			$.time.text = "00:00:00";
		} else {
			$.updateTimer(true);
		}
		
		//If startTime != null, start the timer
		if(Alloy.Globals.Timer.startTime){
			$.start();
		}
	}
}

