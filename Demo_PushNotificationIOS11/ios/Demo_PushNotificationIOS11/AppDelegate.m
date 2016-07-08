/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RCTPushNotificationManager.h"


@interface AppDelegate ()

@property (nonatomic, strong)NSDictionary *userInfoDic;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  [[RCTBundleURLProvider sharedSettings] setDefaults];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  if (TARGET_IPHONE_SIMULATOR) {
    jsCodeLocation = [NSURL URLWithString:@"http://127.0.0.1:8081/index.ios.bundle?platform=ios&dev=true"];
  } else {
    jsCodeLocation = [NSURL URLWithString:@"http://192.168.10.208:8081/index.ios.bundle?platform=ios&dev=true"]; // Change this to your IP if you want to test on device
  }
  

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Demo_PushNotificationIOS11"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
//  NSString *sss = @"eeee";
//   NSDictionary* message =
  
  
//程序未运行时接收到通知，点消息栏启动应用会接收到消息
  if (launchOptions) {
    self.userInfoDic = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    // 延迟执行
//    [self delayMethod];
    [self performSelector:@selector(delayMethod) withObject:nil afterDelay:1.0];
  }
  
  
  // iOS推送
//  UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
//                                                  UIUserNotificationTypeBadge |
//                                                  UIUserNotificationTypeSound);
//  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes
//                                                                           categories:nil];
//  [application registerUserNotificationSettings:settings];
//  [application registerForRemoteNotifications];

  
  return YES;
}

- (void)delayMethod {
  [RCTPushNotificationManager didReceiveRemoteNotification:self.userInfoDic];
  
  // 测试未运行时获取消息
//  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:self.userInfoDic options:NSJSONWritingPrettyPrinted error:nil];
//  NSString *sss = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//  UITextView *textView = [[UITextView alloc] initWithFrame:CGRectMake(100, 100, 200, 100)];
//  textView.backgroundColor = [UIColor redColor];
//  textView.text = sss;
//  [self.window addSubview:textView];
}

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





// iOS推送代理
//-(void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//      NSString *token = [deviceToken description];
//      NSLog(@"description %@", token);
//  
//      token=[NSString stringWithFormat:@"%@",deviceToken];
//      token=[token stringByReplacingOccurrencesOfString:@"<" withString:@""];
//      token=[token stringByReplacingOccurrencesOfString:@">" withString:@""];
//      token=[token stringByReplacingOccurrencesOfString:@" " withString:@""];
//      NSLog(@"token %@", token);
//  
//}
////接收tocken失败
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
//  NSLog(@"tocken失败");
//}
//
//-(void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
//  NSLog(@"userInfo = %@", userInfo);
//}



@end
