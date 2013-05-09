var _args = arguments[0] || {};

if(_args.removeStartStop) {
	removeStartStop();
}

var interval = 1000,
	intervalId = null,
	recording = false,
	start = null,
	totalDuration = elapsed = 0;

totalDuration = _args.time || 0;

if(totalDuration == 0) {
	$.time.text = "00:00:00";
} else {
	updateTimer(true);
}

_args.scale && $.widget.applyProperties({
	transform: Ti.UI.create2DMatrix().scale(_args.scale)
});
_.extend($.widget, _args);

function togglePlayPause(){
	recording ? $.stop() : $.start();
}

function updateTimer(ignoreCurrentTime){
	var time;
	if(ignoreCurrentTime) {
		if(totalDuration == 0) {
			$.time.text = "00:00:00";
			return;
		}
		time = 0;
	} else {
		time = new Date().getTime() - start;
	}
	elapsed = totalDuration + Math.floor(time / 1000);

    var remainingTime = 0;
    var hours = Math.floor(elapsed / 3600);
	remainingTime = elapsed % 3600;
	var minutes = Math.floor(remainingTime / 60);
	remainingTime = remainingTime % 60;
	var seconds = Math.floor(remainingTime);

	function time_string(time) {
    	return ( time < 10 ? "0" : "" ) + time;
  	}

  	hours = time_string(hours);
  	minutes = time_string(minutes);
  	seconds = time_string(seconds);

  	$.time.text = "" + hours + ":" + minutes + ":" + seconds;
}

function removeStartStop() {
	$.widget.remove($.btnPlayPause);
	$.widget.width = 96;
}
$.removeStartStop = removeStartStop;

$.start = function(){
	totalDuration = elapsed;
	start = new Date().getTime();
	intervalId = setInterval(updateTimer, interval);
	$.btnPlayPause.backgroundImage = "/images/com.appcelerator.timer/pause-btn.png";
	$.btnPlayPause.backgroundSelectedImage = "/images/com.appcelerator.timer/pause-btn-touch.png";
	recording = true;
	
	$.widget.fireEvent("TIMER::STARTED", {duration: elapsed});
};

$.stop = function(){
	start = null;
	intervalId && clearInterval(intervalId);
	$.btnPlayPause.backgroundImage = "/images/com.appcelerator.timer/play-btn.png";
	$.btnPlayPause.backgroundSelectedImage = "/images/com.appcelerator.timer/play-btn-touch.png";
	recording = false;
	intervalId = null;
	$.widget.fireEvent("TIMER::STOPPED", {duration: elapsed});
};

$.reset = function(){
	intervalId && clearInterval(intervalId);
	intervalId = null;
	recording = false;
	totalDuration = elapsed = 0;
	start = null;
	$.widget.fireEvent("TIMER::RESET", {});
};

/**
 * getTime
 * 
 * Returns the current time in milliseconds
 */

$.getTime = function(_type){
	if(_type === "text") {
		return $.time.text;
	} else {
		return totalDuration;
	}
};

$.setTime = function(_time) {
	totalDuration = _time;
	updateTimer(true);
};