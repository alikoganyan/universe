import React, { Component } from 'react'
import {
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ImageComponent from './Image'
import helper from '../utils/helpers'
import sendRequest from '../utils/request'
import { setTasks } from '../actions/tasksActions'
import { setCompanies, setContacts } from '../actions/userActions'
import { setDialogs } from '../actions/dialogsActions'
import DefaultAvatar from './DefaultAvatar'
import { setNews } from '../actions/newsActions'

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
          <ImageComponent
            source={{
              uri: `https://testser.univ.team${company.logo}`,
            }}
            size={36}
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
          animationType="fade"
          transparent
        >
          {/* <TouchableWithoutFeedback
            onPress={() => this.setState({ modalVisible: false })}
          > */}
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <Wrapper onPress={() => {
                  this.setState({ modalVisible: false })
                  this.props.navigate('Profile')
                }}>
                  {user.image ? (
                    <UserImage
                      source={{
                        uri: `https://testser.univ.team${user.image}`,
                      }}
                      size={56}
                    />
                    ) : (
                      <DefaultAvatar size={56} />
                    )}
                  <UserText style={{ marginLeft: 4 }}>
                    <UserTextInner>
                      <UserTitle>
                        {user.first_name} {user.last_name}
                      </UserTitle>
                    </UserTextInner>
                  </UserText>
                </Wrapper>
                {companies.map(item => (
                  <Wrapper style={{ marginLeft: 8 }} onPress={() => this.changeCompany(item._id)}>
                    {item.logo ? (
                      <UserImage
                        source={{
                          uri: `https://testser.univ.team${item.logo}`,
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
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </>
    )
  }

  changeCompany = (id) => {
    this.setState({ modalVisible: false })

    sendRequest({
      r_path: '/profile/change_company',
      method: 'patch',
      attr: {
        company_id: id,
      },
      success: res => {
        sendRequest({
          r_path: '/profile',
          method: 'get',
          success: res => {
            this.props.setCompanies({
              companies: res.user.companies,
              company: res.user.company,
            })
          },
          failFunc: () => {},
        })
        this.props.setTasks(res.data.tasks);
        this.props.setContacts(res.data.contacts);
        this.props.setDialogs(res.data.dialogs);
        this.props.setNews(res.data.news);
      },
      full_res: true,
    })
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
    padding: 20,
    zIndex: 2
  },
})

const mapStateToProps = state => ({
  companies: state.userReducer.companies,
  company: state.userReducer.company,
  user: state.userReducer.user,
})

const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setNews: _ => dispatch(setNews(_)),
  setCompanies: _ => dispatch(setCompanies(_)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Company)
