import React from "react";
import TweetDisplay from "./tweetdisplay.js"
import arr from "../stweets.js"

export default class Layout extends React.Component{

render(){
    return <div id="tweetbox" ><TweetDisplay tweetarray = {arr}/></div>;
}

}