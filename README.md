# Demo_PushNotificationIOS

## APNS简介
苹果的设备对于应用程序在后台运行有诸多限制（除非你越狱）。因此，当用户切换到其他程序或者退出程序后，原先的程序无法保持运行状态。对于那些需要保持持续连接状态的应用程序（比如社区网络应用），将不能收到实时的信息。  
为了解决这一限制，苹果推出了`APNS`（苹果推送通知服务）。`APNS`允许设备与苹果的推送通知服务器保持常连接状态。当你想发送一个推送通知给某个用户的iPhone上的应用程序时，你可以使用 `APNS`发送一个推送消息给目标设备上已安装的某个应用程序。  
要使用推送通知功能，首先[在苹果后台配置推送通知服务](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)并且准备好服务端的系统。设置的过程可以参考[Parse的教程](https://github.com/ParsePlatform/PushTutorial/tree/master/iOS)。
## PushNotificationIOS常用的方法
`PushNotificationIOS`是`React Native`对苹果的API的封装，通过js函数来进行推送通知的注册、获取推送的消息、设置角标等功能。

1. 向iOS系统请求通知权限: `static requestPermissions(permissions?: { alert?: boolean, badge?: boolean, sound?: boolean })`   

2. 添加一个监听器，监听远程或本地推送的通知事件: `static addEventListener(type: string, handler: Function)`  
a、监听注册通知：
```
PushNotificationIOS.addEventListener('register', this._registNotification.bind(this));
```
参数：  
第一个参数是监听时间的标识，register表示注册；  
第二个参数是监听回调函数，当注册远程通知时会调用；  
b、监听接收推送消息  
```
PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
```
参数：  
第一个参数，notification表示接收远程推送通知；  
第二个参数，接收到通知时的回调函数；  
3. 获取推送通知的主消息内容 `getMessage()`是`getAlert()`的别名，作用一样
4. 从aps对象中获取推送通知的主消息内容 `getAlert()`
5. 从aps对象中获取推送通知的角标数（未读消息数）`getBadgeCount()` 
6. 获取推送的数据对象 `getData()` 
7. 设置要在手机主屏幕应用图标上显示的角标数（未读消息数）`static setApplicationIconBadgeNumber(number: number)` 
8. 获取目前在手机主屏幕应用图标上显示的角标数（未读消息数）`static getApplicationIconBadgeNumber(callback: Function)` 



