/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  AlertIOS,
  PushNotificationIOS,
  TouchableHighlight,
  NavigatorIOS,
  navigator,
  WebView,
  View
} from 'react-native';


class Demo_PushNotificationIOS11 extends Component {

  // 参数
  state = {
    url: null,  // 传递给详情页使用
    permissions: null
  };
  
  constructor(props) {
    super(props);
    this.state = {url: null, permissions: null};
  }
  
  
  // 组件将要加载
  componentWillMount() {
     // 添加远程推送的监听
     // 注册tocken
     PushNotificationIOS.addEventListener('register', this._registNotification.bind(this));
   
     // 监听事件
     PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
     // 请求权限,测试好像不起作用，3个权限都有
/*      PushNotificationIOS.requestPermissions({ alert: true, badge: false, sound: false });  */
     // 默认请求3个权限
     PushNotificationIOS.requestPermissions();  
  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除远程推送的监听
/*     PushNotificationIOS.removeEventListener('notification', this._onNotification); */
  }

  // 渲染视图
  render() {
    return (
      <NavigatorIOS ref="nav"
      style={{flex:1}}
        initialRoute={{
          component: List,
          title: '首页',
          passProps: {},
        }}
      />
    );
  }

  // 显示权限
  _showPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      console.log("permissions",permissions);
      this.setState.permissions = permissions;
    });
  }

   // 注册tocken的回调函数
  _registNotification(deviceToken){
      console.log('tocken', deviceToken);
      // 获取tocken成功，调用上传tocken的函数
      if(deviceToken) {
	      this._uploadDeviceTocken('http://54.223.56.12/api/v0.4/users/appletoken', 'Bearer 8881bc9737a7fbe26a0d4ee5fa1e4da4b65b62c4', 'dev', deviceToken);
      }
  }
  
  // 将注册成功后请求到的tocken传到服务器
  _uploadDeviceTocken(fetchUrl, authorization, mode, token) {
	  // 获取时间戳
	  let date = new Date();
      console.log('timestamp', date.getTime());
      // 请求接口
      fetch(fetchUrl, {
         method: 'POST',
         headers: {
           'Authorization': authorization,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           'mode': mode,
           'token': token,
           'expire_time':date.getTime(),
         })
       })
       .then((response) => response.text())
       .then((responseText) => {
         console.log(responseText);
       })
       .catch((error) => {
         console.log('error',error);
       });
  }
  
  // 监听收到消息的回调函数
  _onNotification(notification) {
/*   	let _this = this */
    this._showPermissions();
    // 获取消息对象
    const data = notification.getData();
    console.log("data", data);
/*     let userInfo = data.userInfo; */
    this.state.url = data.url;
    
    // 获取主消息内容
    let message = notification.getMessage();
    /*
PushNotificationIOS.getApplicationIconBadgeNumber(function(number){
	    console.log("number", number);
	    PushNotificationIOS.setApplicationIconBadgeNumber(number+1);
    });
*/
    // 设置角标
    PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount());
    AlertIOS.alert(
      '',
      message,
      [{
        text: '取消',
        onPress:function(){
          // 查看一条消息，角标－1
          PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount()-1);
        }
      },
      {
        text: '查看',
        onPress:this._gotoDetail.bind(this, notification),
      }]
    );
  }
  
   // 跳转详情页面
  _gotoDetail(notification) {
    console.log("12345", this.state.url);
    // 查看一条消息，角标－1
    PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount()-1);
    /*
PushNotificationIOS.getApplicationIconBadgeNumber(function(number){
	    console.log("number", number);
	    PushNotificationIOS.setApplicationIconBadgeNumber(number-1);
    });
*/
	this.refs.nav.push({
      component: Detail, 
      title: '详情',
      passProps: {  
         url: this.state.url
      }
    });
  } 
}

//  首页组件
class List extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this._gotoDetail.bind(this)}>
          '123456'
        </Text>
      </View>
    );
  }
  
  _gotoDetail() {
	  this.props.navigator.push({
      component: Detail, 
      title: '详情',
      passProps: {  
         url: 'http://baidu.com'
      },
      rightButtonTitle: '右按钮',
      onRightButtonPress: function(){
        alert('提示框');
      }
     });
  } 
}

// 详情页面组件
class Detail extends Component {
  constructor(props) {
        super(props);
        this.state = {
	        url: null
        };
    }
  componentDidMount() {
    this.setState({
        url: this.props.url
    });
  }
    
  render() {
    console.log("this.state.url", this.state.url);
    var url = '';
    if (this.state.url) {
	    url = this.state.url;
    }
    return (
      <View style={styles.container}>
        { this.state.url === null ? <Text></Text> :
            <WebView style={styles.webView} 
		      ref={'webview'}
		      automaticallyAdjustContentInsets={false}
		      style={styles.webView}
		      source={{uri: url}}
		      javaScriptEnabled={true}
		      domStorageEnabled={true}
              decelerationRate="normal"
	          startInLoadingState={true}
		      scalesPageToFit={true}
	        />
	     }
        
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  webView: {
    height:300,
    width:300,
    backgroundColor: '#DC143C',    
  }
});

AppRegistry.registerComponent('Demo_PushNotificationIOS11', () => Demo_PushNotificationIOS11);
