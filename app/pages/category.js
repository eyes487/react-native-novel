import React, {Component,Fragment} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text ,TouchableWithoutFeedback,TouchableHighlight,StatusBar
} from 'react-native';
import {Modal,Toast} from '@ant-design/react-native';
import {BASE_URL} from '../config/host';
import {global} from '../utils/common';
import RefreshListView,{RefreshState} from '../component/refreshListView';

export default class Category extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            refreshState: RefreshState.Idle,
            categoryList: [],
            pageNum: 1
        };
    }
    componentDidMount(){
        this.onHeaderRefresh();
    }
    onHeaderRefresh=()=>{
        const {id} = this.props;

        return fetch(BASE_URL+'/api/novel/chapter/list?page=1&pageSize=15&novelId='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == "0"){
                let data = responseJson.data&&responseJson.data.dataList || [];
                console.log('9999',responseJson)
                this.setState({
                    categoryList: data,
                    pageNum: 2,
                    refreshState: data.length < 15 ? RefreshState.NoMoreData : RefreshState.Idle,
                })
            }else{
                this.setState({
                    refreshState: RefreshState.Failure
                })
                Toast.info(responseJson.message)
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    onFooterRefresh=()=>{
        const {id} = this.props;
        const {pageNum,categoryList} = this.state;

        return fetch(BASE_URL+'/api/novel/chapter/list?page='+pageNum+'&pageSize=15&novelId='+id)
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status == "0"){
                console.log('9999',responseJson)
                let data = responseJson.data&&responseJson.data.dataList || [];
                this.setState({
                    categoryList: categoryList.concat(data),
                    pageNum: pageNum+1,
                    refreshState: data.length < 15 ? RefreshState.NoMoreData : RefreshState.Idle,
                })
            }else{
                this.setState({
                    refreshState: RefreshState.Failure
                })
                Toast.info(responseJson.message)
            }
        })
        .catch((error) =>{
            console.error(error);
        });
        
    }
    goDetail=(index)=>{
        const {go,onClose} = this.props;

        go(index);
        onClose();
    }
    renderItem =(item)=>{
        return (
            <TouchableHighlight underlayColor="#333" key={item.novelNum} onPress={()=>{this.goDetail(item.novelNum)}}>
                <Text style={styles.item}>{item.name}</Text>
            </TouchableHighlight>
        )
    }

    render(){
        const {categoryList, refreshState} = this.state;
        const {visible,onClose} = this.props;
        return (
            <Modal 
                titleColor="#fff"
                style={styles.container}
                visible={visible}
                onClose={onClose}
                maskClosable={true}
                transparent
                animationType="slide"
                
            >
                <Text style={styles.title}>目录</Text>
                <RefreshListView
                    data={categoryList}
                    keyExtractor={(item,index)=>{return index.toString()}}
                    renderItem={(info)=>this.renderItem(info.item)}
                    refreshState={refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                    footerRefreshingText='玩命加载中 >.<'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='-我是有底线的-'
                    footerEmptyDataText='-好像什么东西都没有-'
                />
            </Modal>
          );
    }
 
};

const styles = StyleSheet.create({
    container: {
        width: global.width,
        height: global.height - 90,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    item:{
        height: 50,
        lineHeight: 50,
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: global.borderColor
    },
    title:{
        textAlign: 'center',
        lineHeight: 30,
        color: '#fff',
    },
});
