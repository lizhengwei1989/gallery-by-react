//require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
let imageDatas=require('../data/picture.json');
imageDatas=(function(imageDataArr){
    for(var i= 0;i<imageDataArr.length;i++){
      imageDataArr[i].imageURL=require('../images/'+imageDataArr[i].fileName);
    }
    return imageDataArr;
})(imageDatas);

//let yeomanImage = require('../images/yeoman.png');
function getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high-low)+low);
}
function get30DegRandom(){
    return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30));
}
var ImgFigureComponent=React.createClass({
    handleClick:function(e){
        this.props.inverse();
        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        let  styleObj={},
            imgFigureClassName='img-figure';
        imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
        if(this.props.arrange.pos){
            styleObj=this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            (['Moz','ms','Webkit','O','']).forEach(function(v){
                styleObj[v+'Transform']='rotate('+this.props.arrange.rotate+'deg)';
            }.bind(this));
        }
        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
});
var AppComponent=React.createClass({
  Constant:{
    centerPos:{
        left:0,
        top:0
        },
    hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
        } ,
    vPosRange:{
        x:[0,0],
        topY:[0,0]
        }
      },
    //闭包函数
    inverse:function(index){
        return function(){
            let imgsArrangeArr=this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        }.bind(this)
    },
    //居中的图片
    rearrange:function(centerIndex){
        let imgsArrangeArr=this.state.imgsArrangeArr,
            Constant=this.Constant,
            centerPos=Constant.centerPos,
            hPosRange=Constant.hPosRange,
            vPosRange=Constant.vPosRange,
            hPosRangeLeftSecX=hPosRange.leftSecX,
            hPosRangeRightSecX=hPosRange.rightSecX,
            hPosRangeY=hPosRange.y,
            vPosRangeTopY=vPosRange.topY,
            vPosRangeX=vPosRange.x,
            topImgNum =Math.ceil(Math.random()*2),//一个或没有
            imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1),
            //取出要不聚的上策图片信息
            topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum)),
            imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
            //居中图片位置
            imgsArrangeCenterArr[0].pos=centerPos;
            imgsArrangeCenterArr[0].rotate=0;

            //布局上侧图片信息
            imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index]={
                    pos: {
                        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate:get30DegRandom()
                }
            });
            //左右两侧图片
            for(let i= 0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
                let hPosRangeLORX=null;
                if(i<k){
                    hPosRangeLORX=hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX=hPosRangeRightSecX;
                }
                imgsArrangeArr[i]={
                    pos: {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate:get30DegRandom()
                };
            }
            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
            }
            imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        console.log(imgsArrangeArr)
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
  },
    getInitialState:function(){
        return {
            imgsArrangeArr:[
                /*{
                    pos:{
                        left:'0',
                        top:'0'
                    },
                    rotate:0,
                    isInverse:false
                }*/
            ]
        };
    },
  //组件加载以后，为每张图片计算其位置范围
  componentDidMount:function(){
       let stageDom=this.refs.stage,
           stageW=stageDom.scrollWidth,
           stageH=stageDom.scrollHeight,
           halfStageW=Math.ceil(stageW/ 2),
           halfStageH=Math.ceil(stageH / 2),
           //拿到一个imageFigure的dom
           imgFigureDOM=stageDom.getElementsByTagName('figure')[0],
           imgW=imgFigureDOM.scrollWidth,
           imgH=imgFigureDOM.scrollHeight,
           halfImgW=Math.ceil(imgW/2),
           halfImgH=Math.ceil(imgH/2);
       this.Constant.centerPos={
           left:halfStageW-halfImgW,
           top:halfStageH-halfImgH
       };
       this.Constant.hPosRange.leftSecX[0]=-halfImgW;
       this.Constant.hPosRange.leftSecX[1]=halfStageW-3*halfImgW;
       this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
       this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
       this.Constant.hPosRange.y[0]=-halfImgH;
       this.Constant.hPosRange.y[1]=stageH-halfImgH;
       this.Constant.vPosRange.topY[0]=-halfImgH;
       this.Constant.vPosRange.topY[1]=halfStageH-3*halfImgH;
       this.Constant.vPosRange.x[0]=halfStageW-imgW;
       this.Constant.vPosRange.x[1]=halfStageW;
       this.rearrange(0);
  },
  render:function(){
    let controllerUnits=[],
        imgFigures=[];
    imageDatas.forEach(function(value,index){
        if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index]={
                pos:{
                    left:0,
                    top:0
                },
                rotate:0,
                isInverse:false
            };
        }
        imgFigures.push(<ImgFigureComponent data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} />);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <section className="controller-nav">
          {controllerUnits}
        </section>
      </section>
    );
  }
});
AppComponent.defaultProps = {
};

export default AppComponent;
