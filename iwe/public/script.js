var tweetColor = "rgb(255, 255, 255)";
var tweetHoverColor = "rgb(242, 241, 237)";
var timer;

  //  the enlargening...
[].forEach.call(document.getElementsByClassName('tweet'), function(el){
   //   el.style["min-height"] = "60px"; 
      el.style["padding"] = "15px 21px";
      el.style["font-size"] = "20px"; 
      el.style["line-height"] = "23px";

});

// hover actions
[].forEach.call(document.getElementsByClassName('tweet'), function(el){
el.addEventListener("mouseenter", function(){
   el.style["backgroundColor"] = tweetHoverColor;
   timer = window.setTimeout(function(){
    var str = el.querySelector("p.tweet-text").textContent;
    scribble(str);
    tts(str);
    console.log(str); 
   }, 20);

});

el.addEventListener("mouseleave", function(){
   el.style["backgroundColor"] = tweetColor;
   window.clearTimeout(timer); speechSynthesis.cancel();
});
});

 // open links in new tab
[].forEach.call(document.getElementsByTagName("a"), function(el){
   el.target = "_blank";
});

var context = new AudioContext();
var output = context.createGain();
output.connect(context.destination);

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

var msg = new SpeechSynthesisUtterance();
window.speechSynthesis.onvoiceschanged = function() {
    var voices = window.speechSynthesis.getVoices();
  //  console.log(voices);
  

var voiceindex = 4;
//what to pick for the voice index:.....
//4 : an english guy (funny)
// 7: french guy / girl (funny)
//8: indian
//12 : korean
//14: slovenian

msg.voice = voices[voiceindex]; 
msg.volume = 1; // 0 to 1
msg.rate = 0.8; // 0.1 to 10
msg.pitch = 1.2; //0 to 2
msg.text = '';
msg.lang = 'en-US';

    
};


function tts(str){
  msg.text = rmvTild(rmvBrk(rmvAt(rmvAt(rmvAt(str, '@'), '@'), '#')));
  speechSynthesis.speak(msg);
}

//p5 part for demo...

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
if(strArr){
//    beginShape();
stroke(0);
wmap = [];
strArr.forEach(function(word, i){
  var x = noise(i, b)*600;
  var y = noise(b, i)*600;
  wmap.push({w: word, xx: x, yy: y});
 //   vertex(x, y);
//  text(word, x, y);
});
//  endShape();

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
    //console.log(strArr);
    b+= 500;
  redraw();
}
function web(){ background(255,255,255,200);
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
