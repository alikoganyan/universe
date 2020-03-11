import React from 'react'
import { Text } from 'react-native'
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation'
import styled from 'styled-components'
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
  Restore2,
  Restore3,
  GroupInfo,
  GroupName,
  Settings,
  News,
  NewPost,
  CreateTask,
  Profile,
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
  NewFeedReceivers,
  ProfileEdit,
  NewTaskReceivers,
  NewGroupParticipants,
  NewGroup,
  FeedReceivers,
  TaskEdit,
  GroupEdit,
  IpadView,
  WebView,
  MapView,
  VideoView,
} from '.'
import { ContactsMenuIcon, SettingsMenuIcon } from '../assets'

import DialogTabIcon from '../tabIcons/DialogTabIcon'
import CreatePassword from './CreatePassword/CreatePassword'
import ChangePhone from './ChangePhone/ChangePhone'
import NewsTabIcon from '../tabIcons/NewsTabIcon'
import TasksTabIcon from '../tabIcons/TasksTabIcon'

const Label = styled(Text)`
  margin-top: 3;
  margin-bottom: -5;
  font-family: 'OpenSans';
  font-size: 10;
  color: ${({ color }) => color};
  text-align: center;
`

const TabBarNavigation = createBottomTabNavigator(
  {
    News: {
      screen: News,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <NewsTabIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#fdb557' : '#a3a3a3'}>Новости</Label>
        ),
        navigation,
      }),
    },
    Contacts: {
      screen: ContactGroups,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <ContactsMenuIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#70d0af' : '#a3a3a3'}>Контакты</Label>
        ),
        navigation,
      }),
    },
    Dialogs: {
      screen: Dialogs,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <DialogTabIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#4a83fa' : '#a3a3a3'}>Диалоги</Label>
        ),
        navigation,
      }),
    },
    TasksTab: {
      screen: TasksList,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <TasksTabIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#8b81c5' : '#a3a3a3'}>Задачи</Label>
        ),
        navigation,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <SettingsMenuIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#f96281' : '#a3a3a3'}>Настройки</Label>
        ),
        navigation,
      }),
    },
  },
  {
    initialRouteName: 'Dialogs',
    backBehavior: 'Dialogs',
    resetOnBlur: true,
    tabBarOptions: {
      style: {
        paddingVertical: 8,
      },
      showIcon: true,
      inactiveTintColor: '#a3a3a3',
    },
  },
)

const publicNavigation = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        gesturesEnabled: false,
      },
      defaultNavigationOptions: {
        gesturesEnabled: false,
      },
    },
    Signup: { screen: Signup },
    Signup2: { screen: Signup2 },
    Signup3: { screen: Signup3 },
    CreatePassword: { screen: CreatePassword },
    PinCode: { screen: PinCode },
    Restore: { screen: Restore },
    Restore2: { screen: Restore2 },
    Restore3: { screen: Restore3 },
  },
  {
    headerMode: 'none',
  },
)

const AppStackNavigator = createStackNavigator(
  {
    Dialogs: { screen: TabBarNavigation },
    Group: { screen: Group },
    Chat: { screen: Chat },
    GroupInfo: { screen: GroupInfo },
    GroupName: { screen: GroupName },
    NewPost: { screen: NewPost },
    CreateTask: { screen: CreateTask },
    Profile: { screen: Profile },
    NewsComments: { screen: NewsComments },
    TasksInc: { screen: TasksInc },
    TasksOut: { screen: TasksOut },
    Tasks: { screen: Tasks },
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
    IpadView: { screen: IpadView },
    FeedReceivers: { screen: FeedReceivers },
    TaskEdit: { screen: TaskEdit },
    GroupEdit: { screen: GroupEdit },
    WebView: { screen: WebView },
    MapView: { screen: MapView },
    VideoView: { screen: VideoView },
    ChangePhone: { screen: ChangePhone },
  },
  {
    initialRouteName: 'Dialogs',
    headerMode: 'none',
  },
)

const switchNavigator = (signedInd, navigation) =>
  createSwitchNavigator(
    {
      Auth: {
        screen: publicNavigation,
        navigationOptions: {
          navigation,
        },
      },
      App: AppStackNavigator,
    },
    {
      initialRouteName: signedInd ? 'App' : 'Auth',
    },
  )

// export default createRootNavigator

export const RootNavigator = (signedInd, navigation) => {
  return createAppContainer(switchNavigator(signedInd, navigation))
}
