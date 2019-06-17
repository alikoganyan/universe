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
import { connectActionShee } from "@expo/react-native-action-sheet";
console.disableYellowBox = true;

const DialogDrawerNavigator = createDrawerNavigator({
    Home: { screen: Dialogs }
}, {
    drawerWidth: Dimensions.get("window").width * 0.8,
    contentComponent: ({ navigation }) => (
        <DrawerComponent navigation={navigation} />
    )
});
const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: FirstScreen,
        navigationOptions: {
            headerMode: 'none',
            gesturesEnabled: false,
        }
    }
}, {
    drawerWidth: Dimensions.get("window").width * 0.8,
    contentComponent: ({ navigation }) => (
        <DrawerComponent navigation={navigation} />
    ),

});
const AppStackNavigator = createStackNavigator({
    Group: { screen: Group },
    Dialogs: {
        screen: DialogDrawerNavigator,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    Chat: { screen: Chat },
    Login: {
        screen: Login,
        navigationOptions: {
            gesturesEnabled: false
        },
        defaultNavigationOptions: {
            gesturesEnabled: false
        }
    },
    Signup: { screen: Signup },
    Signup2: { screen: Signup2 },
    Signup3: { screen: Signup3 },
    PinCode: { screen: PinCode },
    Restore: { screen: Restore },
    Restore2: { screen: Restore2 },
    Restore3: { screen: Restore3 },
    GroupInfo: { screen: GroupInfo },
    GroupName: { screen: GroupName },
    Settings: { screen: Settings },
    Contacts: { screen: Contacts },
    News: { screen: News },
    NewPost: { screen: NewPost },
    CreateTask: { screen: CreateTask },
    Profile: { screen: Profile },
    ContactGroups: { screen: ContactGroups },
    NewsComments: { screen: NewsComments },
    Tasks: { screen: Tasks },
    TasksInc: { screen: TasksInc },
    TasksOut: { screen: TasksOut },
    TasksList: { screen: TasksList },
    NewContact: { screen: NewContact },
    NewDialog: { screen: NewDialog },
    FirstInstall: { screen: FirstInstall },
    NewFeed: { screen: NewFeed },
    FeedEdit: { screen: FeedEdit },
    NewTask: { screen: NewTask },
    NewFeedReceivers: { screen: NewFeedReceivers },
    ProfileEdit: { screen: ProfileEdit },
    NewTaskReceivers: { screen: NewTaskReceivers },
    NewGroupParticipants: { screen: NewGroupParticipants },
    NewGroup: { screen: NewGroup },
    FirstScreen: {
        screen: AppDrawerNavigator,
        transitionSpec: {
            duration: 0,
        },
    },
    FeedReceivers: { screen: FeedReceivers },
    TaskEdit: { screen: TaskEdit },
    GroupEdit: { screen: GroupEdit },
}, {
    initialRouteName: "FirstScreen",
    headerMode: "none"
});

const App = createAppContainer(AppStackNavigator);

export default class AppComponent extends React.Component {
    render() {
        return (
            <Provider store={store}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {this.state.loaded ? <App /> : <SplashScreen />}
      </Provider>
        );
    }
    state = {
        loaded: false
    };
    async componentDidMount() {
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