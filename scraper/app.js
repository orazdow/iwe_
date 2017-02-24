const Twit = require('twit');
const fs = require('fs');
const config = require('./config');
const T = new Twit(config);

var tArr = [];
var num = 0;
var mongo = true;
var log = true;
var revlog = false;


function getReplyChain(collection, _id, fname, extended, cb){

var params = {id: _id};
if(extended === true){
params.tweet_mode = 'extended';
}

fname = fname || 'log.txt';

 if(typeof _id === 'undefined' || !_id){
  	if(revlog){reverselog('rev_'+fname);}
    if(cb){cb();}
  	return;
  }

T.get('statuses/lookup', params, (err, data)=>{
if(err){
console.log(err);
}
else{

if(typeof  data[0] === 'undefined' || ! data[0]){
  	if(revlog){reverselog('rev_'+fname);}
    if(cb){cb();}
  	return;	
}

if(extended === true){
  data[0].text = data[0].full_text;
  data[0].full_text = null;
}

var reply = data[0].in_reply_to_status_id_str;

handleTweet(data, collection, num++, fname, ()=>{

getReplyChain(collection, reply, fname, extended, cb);

});


}

});

}

function showTweet(_id, keyopt, extended){
var params = { id: _id};
if(arguments.length > 2 && extended === true){
params = { id: _id, tweet_mode: 'extended'};
}

T.get('/statuses/lookup', params, (err, data)=>{
if(err){
console.log(err);
}else{
if(typeof keyopt === 'undefined'){
  console.dir(data[0]);
}else{
   console.dir(data[0][keyopt]);
}  
}

});

}

function handleTweet(data, collection, num, fname, cb){
var t = data[0];

if(revlog){
tArr.push(t);
}
if(mongo){
collection.insert(t, { ordered: false })
.catch(function(err) {
  //catch fails on duplicates.
 });
}
var str = '\r\n'+t.user.name+' '+t.id_str+'\r\n'+num+' '+t.created_at+'\r\n'+t.text+'\r\n'+'in_reply_to: '+t.in_reply_to_status_id_str+'\r\n';
console.log(str);
if(log){
fs.appendFile(fname, str, function (err) {
//console.log(err);
cb();
});
}else{cb();}
}

function reverselog(fname){
console.log('making reversed log...'); 
for( var i = tArr.length - 1; i >= 0; i--) {
	var num = (tArr.length-1) - i;
	var t = tArr[i];
var str = '\r\n'+t.user.name+' '+t.id_str+'\r\n'+num+' '+t.created_at+'\r\n'+t.text+'\r\n'+'in_reply_to: '+t.in_reply_to_status_id_str+'\r\n';
fs.appendFile(fname, str, function (err) {
  if(err){console.log(err);}
 }); 
}
console.log('done');
}



function getSortedDB(collection, cb){

 collection.find().sort({id : 1}).toArray((err, docs)=>{     
 if(err){
 	cb(err);
 }
 else{
 	cb(docs);
 }
      
 });

}

function sortedDbToJSON(collection, fname){
  fname = fname || 'data.json';
	collection.find().sort({id : 1}).toArray((err, docs)=>{     
    if(!err){
    var json = JSON.stringify(docs);  
    fs.writeFile(fname, json, 'utf8', ()=>{
    	console.log('wrote json');
    });   
	}   
    else{console.log(err)}
	});


}

function setMongo(bool){
	mongo = bool;
}

function setLog(bool){
	log = bool;
}

function setRevLog(bool){
  revlog = bool;
}

module.exports = {
	getReplyChain: getReplyChain,
	setMongo : setMongo,
	setLog : setLog,
  setRevLog : setRevLog,
	showTweet : showTweet,
	getSortedDB : getSortedDB,
	sortedDbToJSON : sortedDbToJSON
}

