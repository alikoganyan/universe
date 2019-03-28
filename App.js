import React from 'react';
import { View, Text, Dimensions, BackHandler } from 'react-native';
import GlobalFont from 'react-native-global-font'
import { Font } from 'expo';
import {
  Group,
  Dialogs,
  Chat,
  Signup,
  Signup2,
  Signup3,
  PinCode,
  Login,
  Restore,
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
  TasksList,
  NewContact,
  FirstInstall,
  NewFeed,
  SplashScreen,
  NewFeedParticipants,
  ProfileEdit,

} from './Components'
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import {
  createStore,
} from 'redux';

import { Provider } from 'react-redux';
import reducers from './reducers/'
import devToolsEnhancer from 'remote-redux-devtools';
import {
  connectActionSheet,
} from '@expo/react-native-action-sheet';
console.disableYellowBox = true;
const AppDrawerNavigator = createDrawerNavigator(
  {
    // Home: { screen: Login },
    Home: { screen: Dialogs },
  },
  {
    drawerWidth: Dimensions.get('window').width * 0.8,
    contentComponent: ({ navigation }) => <DrawerComponent navigation={navigation} />,
  },
);
const AppStackNavigator = createStackNavigator(
  {
    Group: { screen: Group },
    Dialogs: {
      screen: AppDrawerNavigator,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Chat: { screen: Chat },
    Login: {
      screen: Login, navigationOptions: {
        gesturesEnabled: false,

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
    TasksList: { screen: TasksList },
    NewContact: { screen: NewContact },
    NewDialog: { screen: NewDialog },
    FirstInstall: { screen: FirstInstall },
    NewFeed: { screen: NewFeed },
    NewFeedParticipants: { screen: NewFeedParticipants },
    ProfileEdit: { screen: ProfileEdit },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
)

const App = createAppContainer(AppStackNavigator)
const store = createStore(reducers, devToolsEnhancer())
@connectActionSheet
export default class AppComponent extends React.Component {
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('./assets/fonts/Roboto-Medium.ttf'),
    });
    GlobalFont.applyGlobal('Roboto')
    this.setState({ loaded: true })

    BackHandler.addEventListener("hardwareBackPress", () => { })
  }
  render() {
    return (
      <Provider store={store}>
        {this.state.loaded ? <App /> : <SplashScreen />}
      </Provider>
    )
  }
  state = {
    loaded: false
  }
}
