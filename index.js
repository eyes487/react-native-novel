/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation';
import AppStackNavigator from './app/navigator/appNavigators'
import {name as appName} from './app.json';
import { Provider } from '@ant-design/react-native';


const AppNavigation = createAppContainer(AppStackNavigator)
AppRegistry.registerComponent(appName, () => AppNavigation);

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
 
console.disableYellowBox = true // 关闭全部黄色警告

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    assert: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
    time: () => {},
    timeEnd: () => {},
  };  
}