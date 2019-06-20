import React from 'react';
import { Dimensions } from 'react-native';
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
} from "./";
import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from "react-navigation";




export const createRootNavigator = (logged = false) => {
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
            headerLeft: null,
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
        initialRouteName: logged ? "Dialogs" : "Login",
        headerMode: "none"
    });

    return createAppContainer(AppStackNavigator); 
};