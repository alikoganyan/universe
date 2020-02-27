package elize.univ.team;

import android.app.Application;

import com.reactlibrary.RNReactNativeDocViewerPackage;
import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.actionsheet.ActionSheetPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.horcrux.svg.SvgPackage;
import com.rnfs.RNFSPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import java.util.Arrays;
import java.util.List;

import com.airbnb.android.react.maps.MapsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage()
          ,new RNReactNativeDocViewerPackage()
          ,new RNFirebaseAnalyticsPackage()
          ,new RNFetchBlobPackage()
          ,new RNFusedLocationPackage()
          ,new ReactVideoPackage()
          ,new ActionSheetPackage()
          ,new FastImageViewPackage()
          ,new LinearGradientPackage()
          ,new RNGestureHandlerPackage()
          ,new AsyncStoragePackage()
          ,new AutoGrowTextInputPackage()
          ,new VectorIconsPackage()
          ,new MapsPackage()
          ,new RNDeviceInfo()
          ,new DocumentPickerPackage()
          ,new ImagePickerPackage()
          ,new RNFSPackage()
          ,new SvgPackage()
          ,new RNFirebasePackage()
          ,new RNFirebaseMessagingPackage()
          ,new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
