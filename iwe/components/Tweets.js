import React from 'react';
import Tweet from 'react-tweet';

export default class TweetComponent extends React.Component {

  render () {

    return (
        <Tweet data={this.props.tweetData} />
    )
  }
};



