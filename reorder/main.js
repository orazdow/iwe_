import iwe from './iwe.js';

console.log(iwe);

var ww = 800;
var wh = 700;
var a = 0, b = 0;
var dots = [];
var order = [];
window.reorder = [];
let d = 2;

window.onload = ()=>{
	// console.log('hihihi');
}

function drawDots(arr){
	for(var i = 0; i < arr.length; i++){
		ellipse(arr[i].x, arr[i].y, 4, 4);
	}
}

function check(x, y, arr, d){
	for(var i = 0; i < arr.length; i++){
		if(Math.sqrt((x - arr[i].x)**2 + (y - arr[i].y)**2) < d){
			return arr[i];
		}
	}
	return null;
}

window.setup = function(){
	canvas = createCanvas(ww, wh);
	window.disp = document.querySelectorAll("#disp")[0];	
	window.ul = document.querySelectorAll("#numberList")[0];	
	canvas.parent(window.disp);
	window.disp.style.float = "left";
	noiseDetail(5, 0.3);
	noStroke();
	// noLoop();
	background(92);
	for(var i = 0; i < iwe.length; i++){
		iwe[i].x = Math.floor(50+Math.random()*750);
		iwe[i].y = Math.floor(50+Math.random()*650);
		// iwe[i].x = randomGaussian(300, 250);
		// iwe[i].y = randomGaussian(300, 250);
		dots.push({x:iwe[i].x, y:iwe[i].y, iwe: iwe[i]});
	}
	window.iwe = iwe;
}

window.read = function(){
	for(var i = 0; i < window.reorder.length; i++){
		console.log(window.reorder[i]);
	}
}

function addToList(ul, str){
	let li = document.createElement("li");
	li.innerHTML = str;
	ul.appendChild(li);
}

window.draw = function(){
	// ellipse(50,50,50,50);
	background(200);
	fill(200,0,0);
	drawDots(dots);
	fill(255);
	a += 0.002; //b+=0.0002;
	for (var i = 0; i < 9; i++){
		b+=0.00001;
		let x = noise(i+b, a)*ww*1.3;
		let y = noise(2000+i+b, 2000+a+b)*wh*1.3;

		let ret = check(x, y, dots, d);
		if(ret){
			fill(255, 0, 0);
			if(!ret.added){
				order.push(ret);
				ret.added = true;
				window.reorder.push(ret.iwe.text);
				let str = ret.iwe.text;
				// console.log(str);
				str = str.replace(/<p>|<i>|<br>/gm, '');
				addToList(window.ul, str);
				// addToList(window.ul, changeSubj(rmvTild(rmvBrk(rmvAt(rmvAt(rmvAt(str, '@'), '@'), '#')))));
				//console.log(order);
			}
		}
	 	ellipse(x, y, 10, 10);
	 	fill(255);
	}
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

function changeSubj(str){
	return str.replace('subj ', 'subge ');
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

