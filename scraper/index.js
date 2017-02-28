const Mongoclient = require('mongodb').MongoClient;
const app = require('./app');
Mongoclient.connect("mongodb://localhost:27017/iwe", mongoConnect);
var usedb = true;

function mongoConnect(err, db){

if(err){
  console.log('mongo error. not using db');
  usedb = false;
  app.setMongo(false);
}
	if(usedb){
	console.log('...'); 	
	var collection = db.collection('tweets');
	collection.createIndex({ "id" : 1 }, { unique : true });
	}

     app.setLog(false);

     //: climb tweet reply chain, push to db, and log
     //: collection, id, log name, use extended tweets (opt), callback (opt)
    app.getReplyChain(collection, '832091821245419521', 'log0.txt', true, ()=>{

    	     app.getReplyChain(collection, '490731638327083008', 'log1.txt', true, ()=>{

    	         app.getReplyChain(collection, '515532744378818560', 'log2.txt', true, ()=>{

					      app.getReplyChain(collection, '538024586198405120', 'log3.txt', true, ()=>{
				    	
					      });
    	
            });
    	
        });

   });


     //: sort db, write to json
    //app.sortedDbToJSON(collection);

    //: same, sets thumbnail img hrefs so local filenames
   //app.dbToJSONImgRef(collection, 'imgref.json', 'MaxRazdow', 'mimg.jpg', 'jamiezigelbaum', 'jimg.jpg');


      //: view tweet by id, data field (opt), extended (opt)
   //app.showTweet('490566548306661376', 'text', true);


}

//  end of chain tweets:
// '832091821245419521' 
// '490731638327083008' 
// '515532744378818560' 
// '538024586198405120'