import React from "react";
import TweetComponent from "./Tweets.js"

const ulStyle = {
  "listStyleType" : "none"
};

const TweetDisplay = (props) => {

	const tweetarray = props.tweetarray;
	const listItems = tweetarray.map((tweet, i) =>
	    <li key={i.toString()}> 
	    <TweetComponent tweetData = {tweet}/>
	    </li>
	);

    return ( <ul style={ulStyle}>{listItems}</ul> );
         
};

export default TweetDisplay;


