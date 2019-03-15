import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  Group,
  Dialogs,
  Chat,
  Signup,
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
} from './Components'
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import {
  createStore,
} from 'redux';

import { Provider } from 'react-redux';
import reducers from './reducers/'

import {
  connectActionSheet,
} from '@expo/react-native-action-sheet';

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: Dialogs },
  },
  {
    drawerWidth: Dimensions.get('window').width * 0.8,
    contentComponent: ({ navigation }) => <DrawerComponent navigation={navigation} />,
    headerMode: 'none',
  },

);
const AppStackNavigator = createStackNavigator(
  {
    Home: { screen: Group },
    Group: { screen: Group },
    Dialogs: {
      screen: Dialogs,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Chat: { screen: Chat },
    Login: { screen: Login },
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
    NewsComments: { screen: NewsComments },
    Tasks: { screen: Tasks },
    TasksList: { screen: TasksList },
    NewContact: { screen: NewContact },
    NewDialog: { screen: NewDialog },
    FirstInstall: { screen: FirstInstall },
  },
  {
    headerMode: 'none',
  })
const App = createAppContainer(AppStackNavigator)
const store = createStore(reducers)
@connectActionSheet
export default class AppComponent extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
