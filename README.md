# Demo_PushNotificationIOS

## APNS简介
苹果的设备对于应用程序在后台运行有诸多限制（除非你越狱）。因此，当用户切换到其他程序或者退出程序后，原先的程序无法保持运行状态。对于那些需要保持持续连接状态的应用程序（比如社区网络应用），将不能收到实时的信息。  
为了解决这一限制，苹果推出了`APNS`（苹果推送通知服务）。`APNS`允许设备与苹果的推送通知服务器保持常连接状态。当你想发送一个推送通知给某个用户的iPhone上的应用程序时，你可以使用 `APNS`发送一个推送消息给目标设备上已安装的某个应用程序。  
要使用推送通知功能，首先[在苹果后台配置推送通知服务](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)并且准备好服务端的系统。设置的过程可以参考[Parse的教程](https://github.com/ParsePlatform/PushTutorial/tree/master/iOS)。
## PushNotificationIOS运程推送的主要方法
`PushNotificationIOS`是`React Native`对苹果的API的封装，通过js函数来进行推送通知的注册、获取推送的消息、设置角标等功能。

1. 向iOS系统请求通知权限: `static requestPermissions(permissions?: { alert?: boolean, badge?: boolean, sound?: boolean })`   

2. 添加一个监听器，监听远程或本地推送的通知事件: `static addEventListener(type: string, handler: Function)`  
  a、监听注册通知：
```
PushNotificationIOS.addEventListener('register', this._registNotification.bind(this));
参数：  
第一个参数是监听时间的标识，register表示注册；  
第二个参数是监听回调函数，当注册远程通知时会调用；
```  

  b、监听接收推送消息  
```
PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
参数：  
第一个参数，notification表示接收远程推送通知；  
第二个参数，接收到通知时的回调函数；  
```
3. 获取推送通知的主消息内容 `getMessage()`是`getAlert()`的别名，作用一样  
4. 从aps对象中获取推送通知的主消息内容 `getAlert()`  
5. 从aps对象中获取推送通知的角标数（未读消息数）`getBadgeCount()`   
6. 获取推送的数据对象 `getData()`   
7. 设置要在手机主屏幕应用图标上显示的角标数（未读消息数）`static setApplicationIconBadgeNumber(number: number)`   
8. 获取目前在手机主屏幕应用图标上显示的角标数（未读消息数）`static getApplicationIconBadgeNumber(callback: Function)` 

## 实现远程推送通知的步骤
### 第一步 
#### 链接PushNotificationIOS的库  

* 将`node_modules/react-native/Libraries/PushNotificationIOS/RCTPushNotification.xcodeproj`文件拖到Xcode界面中  
* 在Xcode的`Link Binary With Libraries`中添加`libRCTPushNotification.a`  
* 在`Header Search Paths`中添加: `$(SRCROOT)/../node_modules/react-native/Libraries/PushNotificationIOS`  
* 将搜索选项设为`recursive`   
   
#### 在AppDelegate中启用推送通知的支持以及注册相应的事件 
* 在`AppDelegate.m`开头`#import "RCTPushNotificationManager.h"`
* 在AppDelegate实现中添加如下的代码

```
// 注册消息推送
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// 获取tocken
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// 接收消息
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
```  

### 第二步
在index.ios.js文件中完成下了步骤：
#### 请求推送通知权限
```
PushNotificationIOS.requestPermissions();
默认三个权限都开启
alert 消息内容
badge 显示在icon上的角标
sound 声音
```
#### 注册tocken
```
 PushNotificationIOS.addEventListener('register', this._registNotification.bind(this));
 参数：
 register 表示注册请求远程推送
 this._registNotification.bind(this) 注册的回调函数
```
定义注册的回调函数，  
参数`deviceToken`表示注册成功后，返回给客户端的设备标识；  
获取到deviceToken后，调用_uploadDeviceTocken函数，将deviceToken发送给服务器

```
// 注册tocken的回调函数
_registNotification(deviceToken){
  console.log('tocken', deviceToken);
  // 获取tocken成功，调用上传tocken的函数
  if(deviceToken) {
    this._uploadDeviceTocken('http://54.223.56.12/api/v0.4/users/appletoken', 'Bearer 8881bc9737a7fbe26a0d4ee5fa1e4da4b65b62c4', 'dev', deviceToken);
  }
}
```
定义上传tocken的函数，  
参数：   
fetchUrl 请求地址  
authorization  用户认证  
mode  对应环境  开发环境dev 生产环境online  
token 设备远程推送标识

```
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
```
#### 接收远程推送消息

```
PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this)); 
参数：
notification 表示监听远程消息推送
this._onNotification.bind(this)  表示接收到消息后的回调函数
```
定义接收到消息后的回调函数，
参数`notification`是一个PushNotificationIOS实例，表示当前消息的发送者  
当接收到消息之后，会给用户弹出一个提示框，提示用户是否查看详情；

```
// 监听收到消息的回调函数
_onNotification(notification) {
  // 获取消息对象
  const data = notification.getData();
  // 获取消息对象中的url对象，如果不存在直接返回
  if(data.url == url) {
      return;
  }
  this.state.url = data.url;
    
  // 获取主消息内容
  let message = notification.getMessage();
  // 设置角标
  PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount());
  // 提示框
  AlertIOS.alert(
    '',
    message,
    [{
      text: '取消',
      onPress:function(){
      // 阅读消息后角标－1
        PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount()-1);
      }
    },
    {
      text: '查看',
      onPress:this._gotoDetail.bind(this, notification),
    }]
  );
}
```
定义查看详情的函数，  
在函数中跳转到详情页面，并将从消息中获取的url复制给详情页面，并在详情页面中打开  

```
// 跳转到详情页面
_gotoDetail(notification) {
  // 查看一条消息，角标－1
  PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount()-1);
  this.refs.nav.push({
    component: Detail, 
    title: '详情',
    passProps: {  
      url: this.state.url
    }
  });
}
```
#### 当程序未启动时接收到消息的处理
程序未启动时，接收到通知后点击消息开启应用，接收消息的代理方法：`- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification`不会被触发，但是消息内容会放到程序完成启动的代理方法：`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`的参数launchOptions中；  
所以，在这种情况下的处理是在`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`方法中添加如下代码：  

```
//  程序未运行时接收到通知，点消息栏启动应用会接收到消息
if (launchOptions) {
  // 获取远程推送的消息内容
  self.userInfoDic = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  // 延迟执行
  [self performSelector:@selector(delayMethod) withObject:nil afterDelay:1.0];
  }
```
定义延迟执行方法：  
在方法中将获取到的消息内容发送个推送消息管理对象，这样就可以让PushNotificationIOS监听到远程消息推送  

```
- (void)delayMethod {
  [RCTPushNotificationManager didReceiveRemoteNotification:self.userInfoDic];
}
```

