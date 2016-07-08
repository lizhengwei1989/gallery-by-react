require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let imageDatas=require('../data/picture.json');
//imageDatas=(function(imageDataArr){
//    for(var i= 0;i<imageDataArr.length;i++){
//      imageDataArr[i].imageURL=require('../images/'+imageDataArr[i].fileName);
//    }
//    return imageDataArr;
//})(imageDatas);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render(){
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <section className="controller-nav">
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
