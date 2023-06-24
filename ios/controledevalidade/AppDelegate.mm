#import "AppDelegate.h"

#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>

#import <TSBackgroundFetch/TSBackgroundFetch.h>

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // FIREBASE
    [FIRApp configure];

    // [REQUIRED] Register BackgroundFetch
    [[TSBackgroundFetch sharedInstance] didFinishLaunching];

    self.moduleName = @"controledevalidade";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = @{};

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
