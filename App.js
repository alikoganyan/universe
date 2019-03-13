import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Group, Dialogs, Chat, Signup, PinCode, Login, Restore, GroupInfo, GroupName, Settings, Contacts, News, NewPost, CreateTask, Profile, DrawerComponent, ContactGroups } from './Components'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import Drawer from 'react-native-drawer'

import { Provider, connect } from 'react-redux';
import reducers from './reducers/'

import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';
const RootStack = createStackNavigator(
  {
    // Home: { screen: Login },
    Home: { screen: ContactGroups },
    Group: { screen: Group },
    Dialogs: {
      screen: Dialogs,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Chat: { screen: Chat },
    Signup: { screen: Signup },
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

  },
  {
    headerMode: 'none',
  }
);
const App = createAppContainer(RootStack)
const store = createStore(reducers)

@connectActionSheet
export default class AppComponent extends React.Component {
  drawerOpen = () => {
    this._drawer.open()
  }
  drawerClose = () => {
    this._drawer.close()
  }
  componentDidMount(){
    this.drawerClose()
  }
  render() {
    return (
      <Provider store={store}>
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerComponent closeDrawer={() => this._drawer.close()}/>}
        closedDrawerOffset={0}
      >
        <App />
      </Drawer>
      </Provider>
    )
  }
}
