/**
 * 爬取小说页面
 */
import React, {Component,Fragment} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,TextInput,TouchableHighlight
} from 'react-native';
import { Button ,Toast,Provider} from '@ant-design/react-native';
import {global,appConfig} from '../utils/common';
import {BASE_URL} from '../config/host'

const climbStatus = {
    Init: '',
    Failure: '小说爬取失败',
    Progress: '小说爬取中...，可先刷新观看',
    Success: '小说爬取完成'
}
export default class Climb extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const {navigate} = navigation;
        return({
            headerTitle: '爬取小说',
            ...appConfig.mainNavbar
        })
    };
    constructor(props) {
        super(props);
        this.state = { 
            novelName:'',
            status: climbStatus.Init,
        };
    }

    onClimb =()=>{
        const {novelName} = this.state;
        if(novelName == ''){
            return Toast.info('请输入小说名称')
        }
        this.setState({status: climbStatus.Progress})
        return fetch(BASE_URL+'/api/novel/crawler/name?name='+novelName)
        // return fetch(BASE_URL+'/api/novel/add?url='+novelName+'&num=20')
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('responseJson',responseJson);
            if(responseJson.status == "0"){
                this.setState({
                    status: climbStatus.Success,
                    novelName: ''
                })
            }else{
                this.setState({status: climbStatus.Failure})
            }
        })
        .catch((error) =>{
            console.error(error);
            this.setState({status: climbStatus.Failure})
        });
    }
    render(){
        const {novelName,status} = this.state;
        return (
            <Provider>
                <View style={styles.container}>
                    <StatusBar translucent={true} backgroundColor="transparent"/>
                    <Text style={styles.label}>输入名称抓取小说</Text>
                    <View style={styles.inputBar}>
                        <TextInput
                            value ={novelName}
                            placeholder="小说名称"
                            style={styles.myInput}
                            onChangeText ={(t)=>{this.setState({novelName: t})}}
                        />
                        <TouchableHighlight underlayColor="#eee" onPress={this.onClimb}>
                            <Text style={styles.btn}>确认</Text>
                        </TouchableHighlight>
                    </View>
                    <Text style={styles.tip}>{status}</Text>
                </View>
            </Provider>
          );
    }
 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    label:{
        fontSize: 15,
        lineHeight: 40,
        marginTop: 100
    },
    inputBar:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    myInput:{
        width: global.width - 100,
        height: 34,
        borderColor: global.borderColor,
        borderWidth: 1,
        padding: 0,
        paddingLeft: 10
    },
    btn:{
        width: 80,
        lineHeight: 34,
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        backgroundColor: global.color
    },
    tip:{
        textAlign: 'center',
        lineHeight: 60,
    }
});

