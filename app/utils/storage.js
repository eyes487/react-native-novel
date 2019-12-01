import AsyncStorage from '@react-native-community/async-storage';

async function set(key,value){
    return AsyncStorage.setItem(key,JSON.stringify(value));
}   

async function get(key){
    return AsyncStorage.getItem(key).then((value) => {
        const jsonValue = JSON.parse(value);
        return jsonValue;
    });
}  

export default{
    set,
    get
}