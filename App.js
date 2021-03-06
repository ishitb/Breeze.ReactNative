import { AppLoading, Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, Component } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  AsyncStorage
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";
import { Provider, connect } from "react-redux";

import store from "./redux/store";

class ImageBG extends Component {
  constructor(props) {
    super(props);

    this.BGRef = React.createRef();
  }

  backgroundImages = {
    home_bg: require("./assets/images/backgrounds/home_bg.png"),
    cultural_bg: require("./assets/images/backgrounds/cultural_bg.png"),
    sports_bg: require("./assets/images/backgrounds/sports_bg.png"),
    technical_bg: require("./assets/images/backgrounds/technical_bg.png"),
    cultural_categories: require("./assets/images/backgrounds/cultural_categories.png")
  };

  componentDidMount()
  {
    this.registerDevice();
  }

  async registerDevice()
  {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      // console.log('No notification permissions!');
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    try {
      const value = await AsyncStorage.getItem('registered');
      // console.log(`Value : ${value}`);
      
      if (value !== null)
      return; //Already registered

      const formData = new FormData();
      formData.append("entry.1354444817", token);

      var res = await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSdoidrJK7AD6GN-yIKzMtv2sVVBvalijAiaS06woJbA1qINQQ/formResponse",
        {
          method: "POST",
          body: formData
        }
      );

      var resp = res.body;
      // console.log(resp);
      await AsyncStorage.setItem('registered', 'done.');
    } catch (error) {
     // console.log(error);
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={
          this.props.background
            ? this.backgroundImages[this.props.background]
            : require("./assets/images/backgrounds/home_bg.png")
        }
        ref={this.BGRef}
      >
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </ImageBackground>
    );
  }
}

const MapStateToProps = state => ({
  background: state.UI.background
});

ImageBGComp = connect(MapStateToProps, null)(ImageBG);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <ImageBGComp />
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/Logo.png"),
      require("./assets/images/backgrounds/home_bg.png"),
      require("./assets/images/backgrounds/cultural_bg.png"),
      require("./assets/images/backgrounds/cultural_categories.png"),
      require("./assets/images/backgrounds/sports_bg.png"),
      require("./assets/images/backgrounds/technical_bg.png"),
      require("./assets/images/events_bg/cultural.png"),
      require("./assets/images/events_bg/technical.png"),
      require("./assets/images/events_bg/sports_mob.png"),
      require("./assets/sponsors/townscript.png"),
      require("./assets/sponsors/duassassins.png"),
      require("./assets/sponsors/duexpress.png"),
      require("./assets/sponsors/dubeat.jpg"),
      require("./assets/sponsors/ed.png"),
      require("./assets/sponsors/ATKT.png"),
      require("./assets/sponsors/social-rush.jpg"),
      require("./assets/sponsors/fiesto_nobg.png"),
      require("./assets/sponsors/duvibes.jpg"),
      require("./assets/sponsors/education-tree.png"),
      require("./assets/sponsors/noidadiary.png"),
      require("./assets/sponsors/newsaurchai.png"),
      require("./assets/sponsors/insider.png"),
      require("./assets/sponsors/GrabOn.png"),
      require("./assets/sponsors/bme.jpg"),
      require("./assets/sponsors/rani.jpg"),
      require("./assets/sponsors/Cornitos.png"),
      require("./assets/sponsors/brewhouse.png"),
      require("./assets/sponsors/longshot-2.jpg"),
      require("./assets/pronights/Moctave.png"),
      require("./assets/pronights/RahulSubramanium.png"),
      require("./assets/pronights/Nalayak.png"),
      require("./assets/pronights/NikhilDsouza.jpeg"),
      require("./assets/pronights/ProgBrothers.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
      "just-fist": require("./assets/fonts/PatuaOne-Regular.ttf"),
      "axiforma-bold": require("./assets/fonts/Axiforma_Bold.otf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
