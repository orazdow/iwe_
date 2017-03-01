
//USER VARIABLES*******************************************
//
//Refresh after changing, if no internet set online to false
//
//************************************************************


// sine tone level:
var tonelev = 0.5;              

// false == us voice (set to false if  no internet)
var online = true;             


// use random speech:         
var useRandom = true;         

// min interval (ms)           
var minRandomInterval = 90000;                  
// max intefval (ms)  (if same, will be const interval)
var maxRandominterval = 7*60*1000;
// timeout to resume randomspeech after interaction (ms)
var randResumeTimeout = 60000;


//voice settings
var mainVoice = 4; // uk engligh
var mainPitch = 1.2;
var mainRate = 0.9;

//**********************************************************
//
//***********************************************************

var tweetColor = "rgb(255, 255, 255)";
var tweetHoverColor = "rgb(242, 241, 237)";
var timer; 
var numtweets = 278;


  //  the enlargening...
[].forEach.call(document.getElementsByClassName('tweet'), function(el){
      el.style["padding"] = "15px 21px";
      el.style["font-size"] = "20px"; 
      el.style["line-height"] = "23px";

});

// hover actions
[].forEach.call(document.getElementsByClassName('tweet'), function(el, i){
	if(online){
	el.addEventListener("mouseenter", function(){
	randCancel(true);	
    el.style["backgroundColor"] = tweetHoverColor;
    //var name = el.querySelector(".fullname > span").textContent;
    // console.log(name);

     timer = window.setTimeout(function(){
   	var str = el.querySelector("p.tweet-text").textContent;
    scribble(str);
    tts(str);
   //	console.log(str); 
   }, 20);

});

el.addEventListener("mouseleave", function(){
   el.style["backgroundColor"] = tweetColor;
   window.clearTimeout(timer); speechSynthesis.cancel();
});

}
else{
   el.addEventListener("mouseenter", function(){
   randCancel();
   el.style["backgroundColor"] = tweetHoverColor;
   speechSynthesis.cancel();
   var str = el.querySelector("p.tweet-text").textContent;
   // var name = el.querySelector(".fullname > span").textContent;
   // console.log(name);
   window.setTimeout(function(){ scribble(str); }, 20);
   timer = window.setTimeout(function(){ tts(str); }, 250);
});

el.addEventListener("mouseleave", function(){
   el.style["backgroundColor"] = tweetColor;
   window.clearTimeout(timer); 
});
}
	el.id = 'tw' + i;

});

 // open links in new tab
[].forEach.call(document.getElementsByTagName("a"), function(el){
   el.target = "_blank";
});

// speech randomizer

var randgo = true;
var randel = document.querySelector('#tw200');

if(useRandom){

var randinterval = randomInterval(minRandomInterval, maxRandominterval) || 10000;
console.log(randMsg());

var randTimer = window.setInterval(function(){ 
    randel.style["backgroundColor"] = tweetColor;
    if(randgo){
	var sel = '#tw'+Math.floor(Math.random()*numtweets);
	randel = document.querySelector(sel);
	window.location.hash = sel;
	randel.style["backgroundColor"] = tweetHoverColor;
	var rstr = document.querySelector(sel+" p.tweet-text").textContent;
	 scribble(rstr);
	 tts(rstr);
	 randinterval = randomInterval(minRandomInterval, maxRandominterval);
	 console.log(randMsg());
	}
}, randinterval);
}

function randCancel(speechcancel){
	if(useRandom){
	randgo = false;
	window.setTimeout(function(){ randgo = true; }, randResumeTimeout);

	if(randel){
	randel.style["backgroundColor"] = tweetColor;
	}
	if(speechcancel){
		speechSynthesis.cancel();
	}
	}
}

function randomInterval(min, max){
	if(min > max){ max = min;}
	return min + Math.floor(Math.random() * ((max+1) - min));
}

function randMsg(){
 return 'next random: '+(randinterval/60000)+' minutes';
}

// tone generator

var context = new AudioContext();
var output = context.createGain();
output.connect(context.destination);

output.gain.value = tonelev;//0.2;

var oscs = [];
for (var i = 0; i < 60; i++) {
    var a = context.createOscillator();
    var b = context.createGain()
    a.frequency.value = 50*(7+Math.pow(1.7, i/18));
    a.start();
    a.connect(b);
    b.gain.value = 0.1;
    b.connect(output);
     oscs.push(b);
}

var n = 0;
window.setInterval(function(){
  for (var i = 0; i < oscs.length; i++) {
    oscs[i].gain.value = 0.2*pow(noise(i, n),3); 
  } n+= 0.1; web();
},50);

///speech synthesis

var msg = new SpeechSynthesisUtterance();
var voices;

window.speechSynthesis.onvoiceschanged = function(){

	voices = window.speechSynthesis.getVoices();
	//console.log(voices);
	var voiceindex = 0;
	if(online){
		voiceindex = mainVoice || 4;
	}

	msg.voice = voices[voiceindex]; 
	msg.volume = 0.9; // 0 to 1
	msg.rate = mainRate || 0.9; // 0.1 to 10

	msg.pitch = 0.3;

	if(online){
	msg.pitch =  mainPitch || 1.2; 	
	}
	 //0 to 2
	msg.text = '';
	msg.lang = 'en-US';

	//0: offline default
	//1: german
	//2: us english
	//3: english female
	//4 : an english guy (good) 
	//5,6 : spanidh
	//7: french guy / girl 
	//8: indian guy / girl (good)
	//9: indonesian
	//10: italian
	//11: japanese
	//12 : korean (good)
	//13: netherlands
	//14: slovenian (good)
	//15: brazil
	//16: russian
	//17, 18, 19: chinese

};

function tts(str){ 
  msg.text = rmvTild(rmvBrk(rmvAt(rmvAt(rmvAt(str, '@'), '@'), '#')));
  speechSynthesis.speak(msg);	
  console.log(str);
}

////p5 part for demo...

var a = 0;
var b = 0;
var strArr;
var  osc;
var wmap = [];

function setup() {

createCanvas(500, 500).parent("display");
noLoop();
textSize(15);
noFill();

}

function draw() {

background(255);
stroke(0);
web();

 // word scribble
if(strArr){
	stroke(0);
	wmap = [];
strArr.forEach(function(word, i){
  var x = noise(i, b)*600;
  var y = noise(b, i)*600;
  wmap.push({w: word, xx: x, yy: y});

});
}

}
function mmap(){
  beginShape();

for (var i = 0; i < wmap.length; i++) {
    vertex(wmap[i].xx, wmap[i].yy);
    text(wmap[i].w, wmap[i].xx, wmap[i].yy);
}
  endShape();
}

function scribble(str){	
	strArr = str.split(' ');
	b+= 500;
	redraw();
}

 // bkgd polygon
function web(){ 
	background(255,255,255,200);
	stroke(0);
 	mmap(); 
 stroke(0,0,0,100);
  beginShape();
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
  vertex(noise(i, j+(a/5))*500, noise(a,j)*500);
  }
}

endShape();
a+= 0.03;

}

// text cleanup functions

function rmvAt(str, char){
  var s = -1; var e = -1;
  var ok = false;
  var endChar = ' ';
  var bump = 0;
  if(char === '<'){
    endChar = '>';
    bump = 1;
  }

  for(var i = 0; i < str.length; i++){
    if(str.charAt(i) === char){
      s = i;
    }
    if(s > -1 && str.charAt(i) === endChar){
      e = i;
    }
    if(s > -1 && e > -1){
      ok = true;
      break;
    }

  }

  if(ok){
    return str.replace(str.substring(s, e+bump), "");
  }else{
    return str;
  }

}

function rmvBrk(str){

   var a = 0;
  while((str.indexOf('<') != -1)){
    a++;
    if(a > 8){
      break;
    }
      str = rmvAt(str, '<');
    }
 
  return str;
}

function rmvTild(str){

   var a = 0;
  while((str.indexOf('~~') != -1)){
    a++;
    if(a > 8){
      break;
    }
      str = str.replace('~~', '');
    }
 
  return str;
}