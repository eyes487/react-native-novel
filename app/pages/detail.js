/**
 * 小说页面
 */
import React, {Component,Fragment} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text ,TouchableWithoutFeedback,TouchableHighlight,StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Button ,Toast,Provider,Modal} from '@ant-design/react-native';
import {global,appConfig} from '../utils/common';
import Category from './category';
import {BASE_URL} from '../config/host';
import Storage from '../utils/storage';

export default class NovelDetail extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            refreshing: false,
            detail: {},
            title: '',
            content: '',
            chapterId: 1,
            showMenu: false,
            bgColor: '#fff',
            textColor: '#333',
            fontSize: 14,
            isHidden: true,
            isNight: false,
            showFont: false,
            categoryVisible: false
        };
    }
    componentDidMount(){
        this.getStorage()
    }
    componentWillUnmount(){
        this.setState({
            bgColor: 'transparent',
            isHidden: false
        })
    }
    //获取内存中的东西
    getStorage =async ()=>{
        const {navigation} = this.props;

        let FictionId = navigation.getParam('id');
        let Color = await Storage.get('Color');
        let FontSize = await Storage.get('FontSize');
        let ChapterId = await Storage.get('FictionId_'+FictionId);
        let IsNight = await Storage.get('IsNight');

        let bgColor = Color&&Color.bgColor || global.colorArr[1].value;
        let textColor = Color&&Color.textColor || global.textColor;
        let fontSize = FontSize || global.fontSize;
        let chapterId = ChapterId || 1;
        let isNight = IsNight || false;
        
        this._refresh(chapterId)
        this.setState({
            bgColor,
            textColor,
            fontSize,
            isNight
        })
    }
    _refresh =(chapterId)=>{
        const {navigation} = this.props;
        this.setState({
            refreshing: true
        })
        
        let id = navigation.getParam('id','')
        return fetch(BASE_URL+'/api/novel/list?id='+chapterId+'&novelId='+id)
        .then((response) => {
            return response.json()
        })
        .then((responseJson) => {
            if(responseJson.status == "0"){
                Storage.set('FictionId_'+id,chapterId)
                let data = responseJson.data&&responseJson.data.dataList[0];
                let name = data.name.replace(/<h1>|<\/h1>/ig, "");
                let content = data.content.replace(/&nbsp;/ig, " ");
                content = content.replace(/<br>,|<br>/ig, "\n");
                this.setState({
                    refreshing: false,
                    title: name,
                    content
                });
                let timer = setTimeout(()=>{
                    clearTimeout(timer)
                    this.refs.totop.scrollTo({x:0,y: 0});
                },0)
            }else{
                Toast.info(responseJson.message)
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    //改变章节
    onChangeChapter =(newId)=>{
        if(newId == 0){
            return Toast.info('前面没有了 >.<')
        }
        this._refresh(newId);
        this.setState({
            chapterId: newId
        })
    }
    //显示菜单
    onShowMenu =()=>{
        this.setState({
            showMenu: !this.state.showMenu,
            isHidden: !this.state.isHidden,
            showFont: false
        })
    }
    onScroll=()=>{
        const {showFont,showMenu,isHidden} = this.state;
        if(!showMenu){
            return
        }
        this.setState({
            showMenu: false,
            isHidden: true,
            showFont: false
        })
    }
    //切换白天、夜晚
    onCutDay =()=>{
        const {isNight} = this.state;
        if(!isNight){
            this.setState({
                bgColor: global.colorArr[5].value,
                textColor: global.colorArr[5].font,
                isNight: !isNight
            })
            Storage.set('Color',{
                bgColor: global.colorArr[5].value,
                textColor: global.colorArr[5].font
            })
            Storage.set('IsNight',!isNight)
        }else{
            this.setState({
                bgColor: global.colorArr[1].value,
                textColor: global.colorArr[1].font,
                isNight: !isNight
            })
            Storage.set('Color',{
                bgColor: global.colorArr[1].value,
                textColor: global.colorArr[1].font
            })
            Storage.set('IsNight',!isNight)
        }
    }
    //改变字体
    onChangeFontSize=(index)=>{
        const {fontSize} = this.state;

        let newFontSize = fontSize + index;
        console.log('newFontSize',newFontSize)
        if(newFontSize == 9 || newFontSize == 21){
            return
        }
        this.setState({
            fontSize: newFontSize
        })
        Storage.set('FontSize',newFontSize)
    }
    //改变背景
    onChangeBg =(obj)=>{
        const {isNight} = this.state;

        let dark = isNight;
        if(obj.id == "font_normal"){
            dark = false;
        }else if(obj.id == "font_night"){
            dark = true;
        }
        this.setState({
            bgColor: obj.value,
            textColor: obj.font,
            isNight: dark
        })
        Storage.set('Color',{
            bgColor: obj.value,
            textColor: obj.font,
        })
        Storage.set('IsNight',dark)
    }
    onOpenCategory=()=>{
        this.setState({
            categoryVisible: true,
            showMenu: false,
        })
    }
    render(){
        const {title, content,showMenu,bgColor,textColor,isHidden,fontSize,isNight,showFont,chapterId,categoryVisible} = this.state;
        const {navigation} = this.props;
        let FictionId = navigation.getParam('id');
        return (
            <Provider>
                <View style={styles.view}>
                <StatusBar translucent={true} backgroundColor="transparent"  hidden={isHidden}/>
                    {
                        showMenu?
                            <View style={styles.topNav}>
                                <Icon style={styles.backIcon} name="chevron-left" onPress={()=>navigation.goBack()}></Icon>
                                <Text style={styles.iconText} onPress={()=>navigation.goBack()}>返回书架</Text>
                            </View>
                        :null
                    }
                    <ScrollView 
                        style={[styles.container,{backgroundColor: bgColor}]} 
                        ref='totop'
                        onScrollBeginDrag={this.onScroll}
                    >
                        <Text style={[styles.title,{color: textColor}]}>{title}</Text>
                        <Text style={[styles.content,{color: textColor,fontSize: fontSize}]} onPress={this.onShowMenu}>{content}</Text>
                        <View style={styles.changeBtnGroup}>
                            <Text style={[styles.changeBtn,styles.last]} onPress={()=>this.onChangeChapter(chapterId-1)}>上一章</Text>
                            <Text style={[styles.changeBtn,styles.next]} onPress={()=>this.onChangeChapter(chapterId+1)}>下一章</Text>
                        </View>
                    </ScrollView>
                    {
                        showMenu?
                        <View style={styles.menu}>
                            <TouchableWithoutFeedback onPress={this.onOpenCategory}>
                                <View style={styles.itemWrap}>
                                    <Text style={{textAlign: 'center'}}><Icon style={styles.iconMenu} name="bookmark"></Icon></Text>
                                    <Text style={styles.iconText}>目录</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({showFont: !showFont})}}>
                                <View style={styles.itemWrap}>
                                    <Text style={{textAlign: 'center'}}><Icon style={[styles.iconMenu,{color: showFont?global.warnColor:'#fff'}]} name="italic"></Icon></Text>
                                    <Text style={styles.iconText}>字体</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.onCutDay}>
                                <View style={styles.itemWrap}>
                                    <Text style={{textAlign: 'center'}}><Icon style={styles.iconMenu} name={isNight?'sun':'moon'}></Icon></Text>
                                    <Text style={styles.iconText}>{isNight?'白天':'夜晚'}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>:null
                    }
                    {
                        showFont?<View style={styles.fontcontainer}>
                                <View style={styles.childMod}>
                                    <Text style={styles.fontLabel}>字号</Text>
                                    <TouchableHighlight underlayColor="#6e6e6e" style={styles.fontBtnTouch} onPress={()=>this.onChangeFontSize(1)}>
                                        <Text style={styles.fontBtn}>放大</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor="#6e6e6e" style={styles.fontBtnTouch} onPress={()=>this.onChangeFontSize(-1)}>
                                        <Text style={styles.fontBtn}>缩小</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.childMod}>
                                    <Text style={styles.fontLabel}>背景</Text>
                                    <Fragment>
                                        {
                                            global.colorArr.map((v,i)=>
                                                <Text style={[styles.bgBtn,{backgroundColor: v.value,borderWidth: bgColor==v.value?1:0}]} key={i} onPress={()=>this.onChangeBg(v)}></Text>
                                                )
                                        }
                                    </Fragment>
                                </View>
                        </View>:null
                    }
                    <Category visible={categoryVisible} id={FictionId} go={this.onChangeChapter} onClose={()=>this.setState({categoryVisible: false})}/>
                </View>
            </Provider>
          );
    }
 
};

const styles = StyleSheet.create({
    view:{
        flex: 1,
        position: "relative"
    },
    container: {
        padding: 10,
        position: "relative",
        zIndex: 10
    },
    title:{
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 20
    },
    content:{
        lineHeight: 30,
        fontSize: global.defaultFontSize,
        position: "relative",
        zIndex: 10,
        color: global.textColor
    },
    topNav:{
        width: global.width,
        height: 50 + StatusBar.currentHeight,
        paddingTop: StatusBar.currentHeight,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000',
        opacity: .9,
        position: 'absolute',
        top: 0,
        zIndex: 10000,
    },
    backIcon:{
        color: '#fff',
        fontSize: 26,
        marginRight: 10,
        marginLeft: 15,
        zIndex: 10000,
    },
    changeBtnGroup:{
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
    },
    changeBtn:{
        color: '#fff',
        paddingLeft: 50,
        paddingRight: 50,
        lineHeight: 34,
        borderWidth: 1,
        borderColor: '#858382',
        fontSize: 15,
        backgroundColor: '#000',
        opacity: 0.9,
    },
    last:{
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    next:{
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    },
    menu:{
        width: global.width,
        height: 60,
        backgroundColor: '#000',
        opacity: .9,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        zIndex: 10000,
    },
    itemWrap:{
        width: global.width/3,
        zIndex: 10000,
        paddingTop: 5,
    },
    iconMenu:{
        fontSize: 20,
        color: '#fff',
        lineHeight: 26,
    },
    iconText:{
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        lineHeight: 30,
        paddingBottom: 5,
    },
    fontcontainer:{
        backgroundColor: '#000',
        opacity: .9,
        position: 'absolute',
        bottom: 60,
        zIndex: 10000,
    },
    childMod:{
        width: global.width,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
    },
    fontLabel:{
        fontSize: 16,
        color: '#fff',
        marginRight: 20
    },
    fontBtn:{
        fontSize: 15,
        color: '#fff',
        borderRadius: 15,
        borderWidth: .5,
        borderColor: '#fff',
        paddingLeft: 30,
        paddingRight: 30,
        lineHeight: 26,
    },
    fontBtnTouch:{
        borderRadius: 15,
        marginRight: 20,
    },
    bgBtn:{
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderColor: global.warnColor
    }

    
});

