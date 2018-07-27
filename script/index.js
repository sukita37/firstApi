function GetLocation(callback) {
    if (!aMapLocation)
        aMapLocation = api.require('aMapLocation');
    aMapLocation.startLocation({
        accuracy: 100,
        filter: 1,
        autoStop: true
    }, function(ret, err) {
        callback.call(this, ret, err);
    });
}


function openNavi(curLon, curLat, tarLon, tarLat, wayPoints) {
    if (!aMapNavi)
        aMapNavi = api.require('aMapNavigation');

    aMapNavi.start({
        start: {
            lon: curLon,
            lat: curLat
        },
        end: {
            lon: tarLon,
            lat: tarLat
        },
        wayPoint: wayPoints,
        type: 'drive',
        strategy: 'fast',
        mode: 'emulator', //GPS导航 emulator 模拟导航
        styles: {
            image: {
                start: 'fs://nav/start.png',
                end: 'fs://nav/end.png',
                way: 'fs://nav/way.png',
                camera: 'fs://nav/camera.png'
            },
            preference: {
                night: false,
                compass: false,
                crossImg: false,
                degree: 30,
                yawReCal: false,
                jamReCal: false,
                alwaysBright: false
            }
        }
    }, function(ret, err) {
        console.log("navi ret = " + JSON.stringify(ret) + ', err = ' + JSON.stringify(err));
    });

}

function ListenNavi() {
    //仅仅安卓版本需要自己完成文本播报,IOS不需要.
    if (api.systemType == "ios")
        return;

    console.log('开启导航提示');
    aMapNavi.navigationTextListener({
        state: true
    }, function(ret, err) {
        //这里测试版的时候，第一次或者前N次会有问题，会有不回调的情况，但是正式版应该就OK了。。
        //{"text":"准备出发，全程二十一点九公里大约需要三十五分钟"}  //这个是ret返回数据的格式
        console.log('listen ret = ' + JSON.stringify(ret) + ', err = ' + JSON.stringify(err));
        //播放语音
        AndroidVoiceReport(ret.text);
    });
}

function AndroidVoiceReport(txt) {
    //这里这个方法是用的官方免费的文本转语音的方法。测试版前几次，或者N次会有可能会有放不出来的情况.
    speechRecognizer.read({
        readStr: txt,
        speed: 60,
        volume: 100,
        voice: 2,
        rate: 8000,
    }, function(ret, err) {
        console.log("speech ret = "+JSON.stringify(ret)+', err = '+JSON.stringify(err));
    });
}
