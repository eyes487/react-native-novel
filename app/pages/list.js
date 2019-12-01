/**
 * 目录页面
 */
import React, {Component,Fragment} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text ,RefreshControl,TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Modal ,Toast,Provider} from '@ant-design/react-native';
import {global,appConfig} from '../utils/common';
import {BASE_URL} from '../config/host';
import Swipeout from 'react-native-swipeout';

const colorArr = ['#82d6ef','#46bb65','#ea6f5a','#c082ef']
const iconArr = ['zap','wind','star','slack','smile','target','activity','sun','radio','loader','award']
export default class NovelList extends Component{
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const {navigate} = navigation;
        return({
            headerTitle: '小说列表',
            ...appConfig.mainNavbar
        })
    };
    constructor(props) {
        super(props);
        this.state = { 
            refreshing: false,
            novelList: []
        };
    }
    componentDidMount(){
        this._refresh()
    }
    _refresh =()=>{
        this.setState({
            refreshing: true
        })
        return fetch(BASE_URL+'/api/novel/article/list')
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == "0"){
                let data = responseJson.data&&responseJson.data.dataList || [];
                this.setState({
                    refreshing: false,
                    novelList: data,
                });
            }else{
                Toast.info(responseJson.message)
            }
        })
        .catch((error) =>{
            this.setState({
                refreshing: false,
            });
            Toast.info(JSON.stringify(error))
            console.error(error);
        });
    }
    goDetail =(id)=>{
        const {navigation} = this.props;

        navigation.navigate('NovelDetail',{id: id})
    }
    onClickDelete=(id)=>{
        Modal.alert('删除', '确认删除该部小说', [
            {
              text: '取消',
              onPress: () => console.log('cancel'),
              style: 'cancel',
            },
            { text: '确认', onPress: () => this.ondelete(id) },
        ]);
    }
    ondelete=(id)=>{
        return fetch(BASE_URL+'/api/novel/delete?novelId='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == "0"){
                Toast.info('删除成功 o(>ω<)o');
                this._refresh();
            }else{
                Toast.info(responseJson.message)
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    renderItem =(item,index)=>{
        let color = colorArr[index%4];
        let swipeoutBtns = [
            {
                text: '删除',
                color: '#fff',
                backgroundColor: 'red',
                onPress:()=>this.onClickDelete(item.id)
            }
        ];
        return (
            <Swipeout right={swipeoutBtns} key={item.id}>
                <TouchableHighlight underlayColor="#eee" style={styles.item} onPress={()=>this.goDetail(item.id)}>
                    <View style={styles.item}>
                        <Icon name={iconArr[index%11]} style={[styles.icon,{backgroundColor: color}]}></Icon>
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        )
    }

    render(){
        const {novelName, novelList,refreshing} = this.state;
        return (
            <Provider>
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this._refresh}
                        tintColor={global.color}
                        />
                    }
                    data={novelList}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.id+''}
                    renderItem={({item,index}) => this.renderItem(item,index)}
                />
                
            </View>
            </Provider>
          );
    }
 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item:{
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: global.borderColor
    },
    icon:{
        width: 30,
        height: 30,
        borderRadius: 20,
        color: '#fff',
        fontSize: 20,
        lineHeight: 30,
        textAlign: 'center',
        marginRight: 10
    },
    name:{
        
    },
    
});

