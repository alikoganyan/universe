import React from "react";
import {
    View,
    Text,
    Dimensions,
    BackHandler,
    AsyncStorage,
    StatusBar
} from "react-native";
import GlobalFont from "react-native-global-font";
import { Font, Asset } from "expo";
import { store } from "./reducers/store";
import { createRootNavigator } from './screens/Navigator';
import {
    Group,
    Dialogs,
    Chat,
    Signup,
    Signup2,
    Signup3,
    FirstScreen,
    PinCode,
    Login,
    Restore,
    Restore2,
    Restore3,
    GroupInfo,
    GroupName,
    Settings,
    Contacts,
    News,
    NewPost,
    CreateTask,
    Profile,
    DrawerComponent,
    ContactGroups,
    NewsComments,
    NewDialog,
    Tasks,
    TasksInc,
    TasksOut,
    TasksList,
    NewContact,
    FirstInstall,
    NewTask,
    NewFeed,
    FeedEdit,
    SplashScreen,
    NewFeedReceivers,
    ProfileEdit,
    NewTaskReceivers,
    NewGroupParticipants,
    NewGroup,
    FeedReceivers,
    TaskEdit,
    GroupEdit,
} from "./screens";
import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from "react-navigation";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import devToolsEnhancer from "remote-redux-devtools";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { setUser, setAuth, setRegisterUserNumber } from './actions/userActions'
import { socket, connectToSocket, disconnectFromSocket } from './utils/socket'


console.disableYellowBox = true;

export default class AppComponent extends React.Component {
    render() {
        const { loaded, logged } = this.state;
        const Navigator = createRootNavigator(logged);
        return (
            <Provider store={store}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                {loaded ? <Navigator/> : <SplashScreen />}
                {/*this.state.loaded ? <App /> : <SplashScreen />*/}
            </Provider>
        );
    }
    state = {
        loaded: false,
        logged: false,
    };
    async componentDidMount() {
        AsyncStorage.getItem('user').then(res => {
            value = JSON.parse(res);
            if (value) {
                store.dispatch(setUser(value));
                store.dispatch(setAuth(value.access_token));
                setTimeout(() => {
                    connectToSocket(value.access_token);
                    this.setState({ logged: true });
                }, 0);
            }

        });
        await this._loadResourcesAsync();

        await Font.loadAsync({
            "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf")
        });
        GlobalFont.applyGlobal("Roboto-Regular");
        this.setState({ loaded: true });

        BackHandler.addEventListener("hardwareBackPress", () => {});
    }
    _loadResourcesAsync = async () => {
        return Promise.all([
            // Asset.loadAsync([
            //   require('./assets/svg/Add.svg'),
            //   require('./assets/svg/Arrow_back.svg'),
            //   require('./assets/svg/Arrow_down_light.svg'),
            //   require('./assets/svg/Close.svg'),
            //   require('./assets/svg/Edit.svg'),
            //   require('./assets/svg/Like.svg'),
            //   require('./assets/svg/Likes.svg'),
            //   require('./assets/svg/Menu.svg'),
            //   require('./assets/svg/News.svg'),
            //   require('./assets/svg/Settings.svg'),
            //   require('./assets/svg/Tasks.svg'),
            // ]),
            Font.loadAsync({
                Roboto: require("./assets/fonts/Roboto-Medium.ttf")
            })
        ]);
    };
}