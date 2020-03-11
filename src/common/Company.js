import React, { Component } from 'react'
import {
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  AsyncStorage,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ImageComponent from './Image'
import helper from '../utils/helpers'
import sendRequest from '../utils/request'
import { setTaskList } from '../actions/tasksActions'
import {
  setCompanies,
  setContacts,
  setReset,
  setUser,
} from '../actions/userActions'
import { setDialogs, setCompanyLoading } from '../actions/dialogsActions'
import DefaultAvatar from './DefaultAvatar'
import { setNews } from '../actions/newsActions'
import { socket } from '../utils/socket'
import { setIsMyProfile } from '../actions/profileAction'

const { fontSize, sidePadding, Colors } = helper
const { lightGrey2 } = Colors

const Wrapper = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 4px ${sidePadding}px 2px;
  border: 0.5px solid ${lightGrey2};
  border-width: 0;
  border-bottom-width: 1px;
  width: 100%;
  height: 74px;
`
const UserImage = styled(ImageComponent)`
  width: ${({ size }) => (size ? size : 50)}px;
  height: ${({ size }) => (size ? size : 50)}px;
  border-radius: ${({ size }) => (size ? size / 2 : 25)}px;
`
const UserText = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-left: 10px;
`

const UserTextInner = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  width: 0;
`
const UserTitle = styled(Text)`
  font-size: ${fontSize.dialogName};
  color: #000000;
  font-family: 'OpenSans-Semibold';
  textShadowColor: ${Colors.black};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`

class Company extends Component {
  state = {
    modalVisible: false,
  }

  render() {
    const { user, company, companies } = this.props
    if (!company) return null
    return (
      <>
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
          {company.logo ? (
            <ImageComponent
              source={{
                uri: `https://seruniverse.asmo.media${company.logo}`,
              }}
              size={36}
              style={{ marginRight: 16 }}
            />
          ) : (
            <DefaultAvatar size={36} style={{ marginRight: 16 }} />
          )}
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
          animationType="fade"
          transparent
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <Wrapper
                  onPress={() => {
                    this.setState({ modalVisible: false })
                    this.props.setIsMyProfile(true)
                    this.props.navigate('Profile')
                  }}
                >
                  {user.image ? (
                    <UserImage
                      source={{
                        uri: `https://seruniverse.asmo.media${user.image}`,
                      }}
                      size={56}
                    />
                  ) : (
                    <DefaultAvatar size={56} />
                  )}
                  <UserText style={{ marginLeft: 4 }}>
                    <UserTextInner>
                      <UserTitle>
                        {!!(user && user.first_name) && `${user.first_name} `}
                        {!!(user && user.last_name) && user.last_name}
                        {!!(
                          user &&
                          !user.first_name &&
                          !user.last_name &&
                          user.phone_number
                        ) && user.phone_number}
                      </UserTitle>
                    </UserTextInner>
                  </UserText>
                </Wrapper>
                {companies.map(item => (
                  <Wrapper
                    key={item._id.toString()}
                    style={{
                      paddingLeft: 8,
                      backgroundColor:
                        item._id === company._id ? '#c1c1c159' : '#ffffff',
                    }}
                    onPress={() => this.changeCompany(item._id)}
                  >
                    {item.logo ? (
                      <UserImage
                        source={{
                          uri: `https://seruniverse.asmo.media${item.logo}`,
                        }}
                        size={40}
                      />
                    ) : (
                      <DefaultAvatar size={40} />
                    )}
                    <UserText style={{ marginLeft: 12 }}>
                      <UserTextInner>
                        <UserTitle>{item.name}</UserTitle>
                      </UserTextInner>
                    </UserText>
                  </Wrapper>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    )
  }

  changeCompany = id => {
    const { company } = this.props
    this.setState({ modalVisible: false })
    if (company._id !== id) {
      this.props.setCompanyLoading(true)
      sendRequest({
        r_path: '/profile/change_company',
        method: 'patch',
        attr: {
          company_id: id,
        },
        success: res => {
          socket.emit('get_dialogs')
          sendRequest({
            r_path: '/profile',
            method: 'get',
            success: data => {
              AsyncStorage.getItem('user').then(res => {
                const value = JSON.parse(res)
                if (value) {
                  value.company = data.user.company
                  AsyncStorage.setItem(
                    'user',
                    JSON.stringify({ ...value, lastLogin: new Date() }),
                  )
                }
              })
              const userData = { ...data }
              this.props.setCompanies({
                companies: userData.user.companies,
                company: userData.user.company,
              })
              this.props.setUser(userData.user)
              const tasksInc = [...res.data.tasks]
              const tasksOut = [...res.data.created_tasks]
              const tasksWithUsers = [...tasksInc, ...tasksOut]
              this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
              this.props.setContacts(res.data.contacts)
              this.props.setNews(res.data.news)
              this.props.setCompanyLoading(false)
              this.props.setReset(true)
            },
            failFunc: () => {
              this.props.setCompanyLoading(false)
            },
          })
        },
        failFunc: () => {
          this.props.setCompanyLoading(false)
        },
        full_res: true,
      })
    }
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    zIndex: 2,
    padding: 20,
  },
})

const mapStateToProps = state => ({
  companies: state.userReducer.companies,
  company: state.userReducer.company,
  user: state.userReducer.user,
})

const mapDispatchToProps = dispatch => ({
  setTaskList: _ => dispatch(setTaskList(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setNews: _ => dispatch(setNews(_)),
  setCompanies: _ => dispatch(setCompanies(_)),
  setUser: _ => dispatch(setUser(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setCompanyLoading: _ => dispatch(setCompanyLoading(_)),
  setReset: _ => dispatch(setReset(_)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Company)
