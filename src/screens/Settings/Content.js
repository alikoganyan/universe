import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import styled from 'styled-components'
import SwitchToggle from 'react-native-switch-toggle'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { p_settings } from '../../constants/api'
import { setSettings } from '../../actions/userActions'
import { BottomSheet } from 'react-native-btr'
import {
  trySignToPushes,
  requestDisablePushes,
} from '../../actions/pushesActions'

const { Colors, sidePadding, fontSize, borderRadius, HeaderHeight } = helper
const { lightGrey1, blue, lightBlue, grey2, white, black } = Colors
const Wrapper = styled(View)`
  padding-top: 0px;
  background: white;
  margin-bottom: 110px;
  padding: 0 ${sidePadding}px;
`
const Box = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-self: center;
  padding: 20px 0;
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? '1px' : 0)};
  margin-top: ${({ first }) => (first ? '10px' : 0)};
`
const Label = styled(Text)`
  flex: 2;
  color: ${grey2};
  font-size: ${fontSize.text};
  margin-right: 5px;
`
const Status = styled(Text)`
  flex: 3;
  font-size: ${fontSize.text};
`
const Option = styled(View)`
  flex: 2;
  display: flex;
  align-items: flex-end;
  font-size: ${fontSize.text};
`
const Link = styled(Text)`
  font-size: ${fontSize.text};
  color: ${blue};
`
const LangPicker = styled(View)`
  background: white;
  width: 94%;
  bottom: 0;
  height: ${Dimensions.get('window').height * 0.3}px;
  position: absolute;
  margin: 0 3%;
  padding: 1% 7%;
  border-radius: ${borderRadius};
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  align-self: center;
  z-index: 4;
`
const LinkText = styled(Text)`
  color: ${blue};
`
const CheckBoxLabel = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Checkbox = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 21px;
`
const CheckboxHolder = styled(View)`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`
const Loading = styled(ActivityIndicator)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff8;
`
const Toggle = props => {
  const { switchOn, onPress } = props
  return (
    <SwitchToggle
      containerStyle={{
        width: 34,
        height: 14,
        borderRadius: 20,
        padding: 0.1,
      }}
      circleStyle={{
        width: 20,
        height: 20,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: white, // rgb(102,134,205)
      }}
      circleColorOn={blue}
      circleColorOff={white}
      backgroundColorOn={lightBlue}
      backgroundColorOff={lightGrey1}
      switchOn={switchOn}
      onPress={onPress}
    />
  )
}
class Content extends Component {
  render() {
    const { settings, pickerOpened, langs, agreements } = this.state
    const {
      user: {
        settings: {
          notifications: { enable: isNotificationsEnabled = false } = {},
        } = {},
      } = {},
      pushesPermissionsGranted,
      userPushesIsFetching,
      permissionsIsFetching,
      tokenIsFetching,
    } = this.props
    return (
      <SafeAreaView>
        <Wrapper>
          <ScrollView
            style={{
              height: Dimensions.get('window').height - HeaderHeight - 20,
            }}
          >
            <Box first>
              <Label>Уведомления</Label>
              <Status>
                {pushesPermissionsGranted && isNotificationsEnabled
                  ? 'Включены'
                  : 'Выключены'}
              </Status>
              <Option>
                <Toggle
                  onPress={this.handleTogglePushes}
                  switchOn={pushesPermissionsGranted && isNotificationsEnabled}
                />
              </Option>
              {(!!userPushesIsFetching ||
                !!permissionsIsFetching ||
                !!tokenIsFetching) && <Loading animating size="small" />}
            </Box>
            <FlatList
              style={{ paddingRight: 5, paddingLeft: 5, maxHeight: 300 }}
              data={settings}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <Box key={index} last={index === settings.length - 1}>
                  <Label>{item.label}</Label>
                  <Status>{item.status || item.language}</Status>
                  <Option>
                    {item.option.type === 'toggle' && (
                      <Toggle
                        onPress={() => this.handleToggle(item.label)}
                        switchOn={!!item.option.value}
                      />
                    )}
                    {item.option.type === 'link' && (
                      <TouchableOpacity onPress={this.selectOption}>
                        <Link>{item.option.value}</Link>
                      </TouchableOpacity>
                    )}
                  </Option>
                </Box>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <CheckboxHolder>
              {agreements.map((e, i) => (
                <Checkbox key={i}>
                  <CheckBoxLabel>
                    <TouchableOpacity>
                      <LinkText>{e.linkText}</LinkText>
                    </TouchableOpacity>
                  </CheckBoxLabel>
                </Checkbox>
              ))}
            </CheckboxHolder>
          </ScrollView>
          <BottomSheet
            visible={pickerOpened}
            onBackButtonPress={this.pickerClose}
            onBackdropPress={this.pickerClose}
          >
            <LangPicker pose={pickerOpened ? 'visible' : 'hidden'}>
              {Object.values(langs).map((e, i) => (
                <TouchableOpacity key={i}>
                  <Text style={{ color: i === 0 ? blue : black }}>{e}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={this.pickerClose}>
                <Text>Отменить</Text>
              </TouchableOpacity>
            </LangPicker>
          </BottomSheet>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    langs: {
      ru: 'Русский',
      en: 'English',
    },
    pickerOpened: false,
    settings: [
      {
        item: 'language',
        label: 'Язык',
        status: 'ru',
        option: { type: 'link', value: 'изменить' },
      },
      {
        item: 'sound',
        label: 'Звук',
        status: 'Включен',
        option: { type: 'toggle', value: 0 },
      },
      {
        item: 'partition_contacts',
        label: 'Контакты',
        status: 'По подразделениям',
        option: { type: 'toggle', value: 0 },
      },
    ],
    agreements: [
      {
        value: false,
        linkText: 'Условия использования',
        linkComp: 'linkComp',
        link: '',
      },
      {
        value: false,
        linkText: 'Пользовательское соглашение',
        linkComp: 'linkComp',
        link: '',
      },
      {
        value: false,
        linkText: 'Соглашение об Использовании персональных данных',
        linkComp: 'linkComp',
        link: '',
      },
    ],
  }

  componentDidMount() {
    const { settings, langs } = this.state
    const { user } = this.props
    const newSettings = [...settings]
    // console.log(settings)
    newSettings.forEach(e => {
      // console.log(e);
      if (e.item === 'language') {
        e.option.value = 'Изменить'
        e.status = langs[e.item]
      }
      if (e.item === 'notifications') {
        // e.status = pushesPermissions ? 'Включены' : 'Выключены';
        // console.log(pushesPermissions, isNotificationsEnabled);
      } else e.option.value = user.settings[e.item]
    })
    setTimeout(() => {
      this.setState({ settings: newSettings })
    }, 0)
  }

  pickerClose = () => {
    this.setState({ pickerOpened: false })
  }

  handleToggle = e => {
    const { settings } = this.state
    const newSettings = [...settings]
    const item = newSettings.filter(({ label }) => e === label)[0]
    item.option.value = !newSettings.filter(({ label }) => e === label)[0]
      .option.value
    this.setState({ settings: newSettings })
  }

  handleTogglePushes = () => {
    const {
      user: {
        settings: {
          notifications: { enable: isNotificationsEnabled = false } = {},
        } = {},
      } = {},
      pushesPermissionsGranted,
      pushesToken,
      requestDisablePushes,
      trySignToPushes,
    } = this.props
    if (isNotificationsEnabled && pushesPermissionsGranted) {
      requestDisablePushes(pushesToken)
    } else {
      trySignToPushes(false)
    }
  }

  selectOption = () => {
    this.setState({ pickerOpened: true })
  }

  componentWillUnmount() {
    const { settings } = this.state
    const { user } = this.props
    const userSettings = user.settings
    const reqBody = {
      language: '',
      sound: '',
      partition_contacts: '',
    }
    settings.forEach(e => {
      if (e.item === 'notifications') {
        reqBody[e.item] = e.item === 'language' ? 'ru' : !!e.option.value
      }
    })
    JSON.stringify(reqBody) !== JSON.stringify(userSettings) &&
      sendRequest({
        r_path: p_settings,
        method: 'patch',
        attr: {
          settings: reqBody,
        },
        success: res => {
          // console.log({ res })
          setSettings(reqBody)
        },
        failFunc: err => {
          // console.log({ err })
        },
      })
  }
}

const mapStateToProps = ({
  messageReducer,
  dialogsReducer,
  userReducer,
  pushesReducer,
}) => ({
  messages: messageReducer,
  dialog: dialogsReducer.dialogs,
  currentRoom: messageReducer.currentRoom,
  currentChat: messageReducer.currentChat,
  user: userReducer.user,
  pushesPermissionsGranted: pushesReducer.permissions,
  pushesToken: pushesReducer.token,
  userPushesIsFetching: pushesReducer.userPushesIsFetching,
  permissionsIsFetching: pushesReducer.permissionsIsFetching,
  tokenIsFetching: pushesReducer.tokenIsFetching,
})
const mapDispatchToProps = dispatch => ({
  setSettings: _ => dispatch(setSettings(_)),
  trySignToPushes: trySignToPushes(dispatch),
  requestDisablePushes: requestDisablePushes(dispatch),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
