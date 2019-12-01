import {Platform,Dimensions,StatusBar} from 'react-native';
import { Header } from 'react-navigation';

const {width,height} = Dimensions.get('window');
export const global ={
    color: '#1DBAF1', //蓝色
    borderColor: '#ECEDF1',
    textColor: '#333',
    warnColor: '#ff7800',
    fontSize: 14,
    width: width,
    height: height,
    colorArr:[{
        value : '#f7eee5',
        name : '米白',
        font : '#333'
    }, {
        value : '#e9dfc7',
        name : '纸张',
        font : '#333',
        id : "font_normal"
    }, {
        value : '#a4a4a4',
        name : '浅灰',
        font : '#333'
    }, {
        value : '#cdefce',
        name : '护眼',
        font : '#333'
    }, {
        value : '#283548',
        name : '灰蓝',
        font : '#7685a2',
        bottomcolor : '#fff'
    }, {
        value : '#0f1410',
        name : '夜间',
        font : '#4e534f',
        bottomcolor : 'rgba(255,255,255,0.7)',
        id : "font_night"
    }]
}



export const appConfig = {
    mainNavbar: {
        headerStyle:{
            backgroundColor: global.color,
            ...Platform.select({
                ios: {
                  borderBottomWidth: 0
                },
                android: {
                  elevation: 0,
                  paddingTop: StatusBar.currentHeight,
                  height: Header.HEIGHT + StatusBar.currentHeight,
                },
            }),
        },
        headerTitleStyle:{
            color: '#fff',
            fontWeight: 'normal',
        },
        headerTintColor: "#fff",
    }
}