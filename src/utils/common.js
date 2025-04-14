export const byteLength = (str) => {
    let b = 0, l = str.length;  //初始化字节数递加变量并获取字符串参数的字符个数
    if (l) {  //如果存在字符串，则执行计划
        for (let i = 0; i < l; i++) {  //遍历字符串，枚举每个字符
            if (str.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符
                b += 2;  //则累加2个
            } else {
                b++;  //递加一次
            }
        }
        return b;  //返回字节数
    } else {
        return 0;  //如果参数为空，则返回0个
    }
};

/**
 * 高德地图定位
 * @type {{}}
 */
export const location = {
    initMap(id) {
        let mapObj = new window.AMap.Map(id, {});
        let geolocation;
        mapObj.plugin(['AMap.Geolocation'], function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //  是否使用高精度定位，默认:true
                timeout: 10000 //  超过10秒后停止定位，默认：无穷大
                /* maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                 convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                 showButton: true, //  显示定位按钮，默认：true
                 buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
                 buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                 showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
                 showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
                 panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
                 zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false*/
            });
        });
        return geolocation;
    }
};

export const getRandomColor = () => {
    let str = '#';
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    for (let i = 0; i < 6; i++) {
        let num = parseInt(Math.random() * 16);
        str += arr[num];
    }
    return str;
};
//随机颜色
export const hexToRgb = (val) => {
    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    let color = val.toLowerCase();
    let result = '';
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            let colorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        let colorChange = [];
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
        }
        result = colorChange.join(',');
        return { hex: val, rgb: result, r: colorChange[0], g: colorChange[1], b: colorChange[2] };
    } else {
        result = '无效';
        return { rgb: result };
    }

};

//特殊字符校验
export const emojiRegex = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;

//判断是否递增函数
export const IncreasingFn = (arrStr) => {
    let IncreasingFn = true;
    let array = arrStr.split(',');
    let arrayCount = array.length - 1;
    for (let i = 0; i < array.length; i++) {
        if (i == arrayCount) {
            break;
        } else {
            let currentArr = Number(array[i]);
            let nestArr = Number(array[i + 1]);
            if (currentArr > nestArr) {
                IncreasingFn = false;
                break;
            } else {
                IncreasingFn = true;
            }
        }
    }
    return IncreasingFn;
};

//获得数组中的最大值
export const MaxNumber = (arrStr) => {
    let max = 0;
    let array = arrStr.split(',');
    let tempArr = [];
    for (let i = 0; i < array.length; i++) {
        let current = Number(array[i]);
        tempArr.push(current)
    }
    max = Math.max.apply(null,tempArr);
    return max;
};



