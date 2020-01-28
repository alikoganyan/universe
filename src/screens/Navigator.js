import React from 'react'
import { Text } from 'react-native'
import {
  createStackNavigator,
  createAppContainer,
  // createDrawerNavigator,
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
import {
  NewsMenuIcon,
  ContactsMenuIcon,
  DialogMenuIcon,
  TasksMenuIcon,
  SettingsMenuIcon,
} from '../assets'

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
        tabBarIcon: ({ focused }) => <NewsMenuIcon focused={focused} />,
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
        tabBarIcon: ({ focused }) => <DialogMenuIcon focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Label color={focused ? '#4a83fa' : '#a3a3a3'}>Диалоги</Label>
        ),
        navigation,
      }),
    },
    TasksTab: {
      screen: TasksList,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => <TasksMenuIcon focused={focused} />,
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

// const createRootNavigator = (logged = false) => {
//   // eslint-disable-next-line no-unused-vars
//   // const AppDrawerNavigator = createDrawerNavigator(
//   //   {
//   //     Home: {
//   //       screen: FirstScreen,
//   //       navigationOptions: {
//   //         headerMode: 'none',
//   //         gesturesEnabled: false,
//   //       },
//   //     },
//   //   },
//   //   {
//   //     drawerWidth: Dimensions.get('window').width * 0.8,
//   //     contentComponent: ({ navigation }) => (
//   //       <DrawerComponent navigation={navigation} />
//   //     ),
//   //     drawerLockMode: 'locked-open',
//   //   },
//   // )
//   const initialRouteName = Platform.isPad
//     ? 'IpadView'
//     : logged
//     ? 'Dialogs'
//     : 'Login'
//   const AppStackNavigator = createStackNavigator(
//     {
//       Group: { screen: Group },
//       Dialogs: TabBarNavigation,
//       Chat: { screen: Chat },
//       Login: {
//         screen: Login,
//         navigationOptions: {
//           gesturesEnabled: false,
//         },
//         defaultNavigationOptions: {
//           gesturesEnabled: false,
//         },
//       },
//       Signup: { screen: Signup },
//       Signup2: { screen: Signup2 },
//       Signup3: { screen: Signup3 },
//       PinCode: { screen: PinCode },
//       Restore: { screen: Restore },
//       Restore2: { screen: Restore2 },
//       Restore3: { screen: Restore3 },
//       GroupInfo: { screen: GroupInfo },
//       GroupName: { screen: GroupName },
//       NewPost: { screen: NewPost },
//       CreateTask: { screen: CreateTask },
//       Profile: { screen: Profile },
//       NewsComments: { screen: NewsComments },
//       TasksInc: { screen: TasksInc },
//       TasksOut: { screen: TasksOut },
//       Tasks: { screen: Tasks },
//       NewContact: { screen: NewContact },
//       NewDialog: { screen: NewDialog },
//       FirstInstall: { screen: FirstInstall },
//       NewFeed: { screen: NewFeed },
//       FeedEdit: { screen: FeedEdit },
//       NewTask: { screen: NewTask },
//       NewFeedReceivers: { screen: NewFeedReceivers },
//       ProfileEdit: { screen: ProfileEdit },
//       NewTaskReceivers: { screen: NewTaskReceivers },
//       NewGroupParticipants: { screen: NewGroupParticipants },
//       NewGroup: { screen: NewGroup },
//       IpadView: { screen: IpadView },
//       // FirstScreen: {
//       //   screen: AppDrawerNavigator,
//       //   transitionSpec: {
//       //     duration: 0,
//       //   },
//       // },
//       FeedReceivers: { screen: FeedReceivers },
//       TaskEdit: { screen: TaskEdit },
//       GroupEdit: { screen: GroupEdit },
//       WebView: { screen: WebView },
//       MapView: { screen: MapView },
//       VideoView: { screen: VideoView },
//     },
//     {
//       initialRouteName,
//       headerMode: 'none',
//     },
//   )
//
//   return createAppContainer(AppStackNavigator)
// }

const publicNavigation = createStackNavigator({
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
  PinCode: { screen: PinCode },
  Restore: { screen: Restore },
  Restore2: { screen: Restore2 },
  Restore3: { screen: Restore3 },
})

const AppStackNavigator = createStackNavigator(
  {
    Group: { screen: Group },
    Dialogs: { screen: TabBarNavigation },
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
    // FirstScreen: {
    //   screen: AppDrawerNavigator,
    //   transitionSpec: {
    //     duration: 0,
    //   },
    // },
    FeedReceivers: { screen: FeedReceivers },
    TaskEdit: { screen: TaskEdit },
    GroupEdit: { screen: GroupEdit },
    WebView: { screen: WebView },
    MapView: { screen: MapView },
    VideoView: { screen: VideoView },
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
