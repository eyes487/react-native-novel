import React from 'react';
import {createStackNavigator,createBottomTabNavigator} from 'react-navigation';
import {View,Text,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from 'react-navigation';
import Climb from '../pages/climb'
import NovelList from '../pages/list'
import { appConfig, global } from '../utils/common';
import NovelDetail from '../pages/detail'
import AA from '../pages/drawer'
const Bottomnavigator = createBottomTabNavigator({
    Climb:{
        screen:Climb,
        navigationOptions:{
            title:'爬取',
            tabBarIcon:({focused,horizontal,tintColor})=>{
                return <Icon name={'copy'} size={22} style={{color:tintColor}}/>
            }
        }
    },
    NovelList:{
        screen:NovelList,
        navigationOptions:{
            title:'小说',
            tabBarIcon:({focused,horizontal,tintColor})=>{
                return <Icon name={'book-open'} size={20} style={{color:tintColor}}/>
            }
        }
    }
},{
    tabBarOptions:{
        activeTintColor:'#1DBAF1',
        labelStyle: {
            fontSize: 12,
        },
        style:{
            borderTopWidth: 1,
            borderTopColor: '#eee'
        }
    }
})

const AppStackNavigator = createStackNavigator({
    AA:{
        screen: AA
    },
    Home:{
        screen:Bottomnavigator,
        navigationOptions: ({navigation })=>({
            headerTitle: (
                <Text style={styles.title}>棋迷小说</Text>
            ),
            ...appConfig.mainNavbar
        })
    },
    NovelDetail:{
        screen: NovelDetail,
        navigationOptions:()=>({
            header: null
        })
    }
    
},{
    initialRouteName:'Home'
})

const styles = StyleSheet.create({
    title: {
        width: global.width,
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: Header.HEIGHT
    },
    
});
export default AppStackNavigator