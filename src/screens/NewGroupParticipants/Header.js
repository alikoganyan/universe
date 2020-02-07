/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  BackIcon,
  SearchIcon,
  CloseIcon,
  CheckGreyIcon,
} from '../../assets/index'
import helper from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import { setTasks } from '../../actions/tasksActions'
import DefaultAvatar from '../../common/DefaultAvatar'

const { sidePadding, HeaderHeight, fontSize, Colors } = helper
const { grey3 } = Colors
const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: ${sidePadding}px;
  padding-left: ${sidePadding}px;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Input = styled(TextInput)`
  margin-left: ${Dimensions.get('window').width * 0.085};
`
const Right = styled(Left)`
  justify-content: flex-end;
`

const HeaderText = styled(Text)`
  font-size: ${fontSize.header};
  position: relative;
  left: -10px;
  color: ${grey3};
`

class HeaderComponent extends Component {
  render() {
    const { back, user, toProfile, participants } = this.props
    const { search, input } = this.state
    const { image } = user
    return (
      <Header>
        <Left>
          {!search ? (
            <>
              <BackIcon onPress={back} right />
              <HeaderText>Добавить получателей</HeaderText>
            </>
          ) : (
            <>
              <SearchIcon />
              <Input
                value={input}
                onChangeText={this.handleInputChange}
                onFocus={this.handleFocus}
                placeholder="Поиск"
              />
            </>
          )}
        </Left>
        <Right>
          {!search ? (
            <>
              <SearchIcon right onPress={this.startSearch} />
              {!participants.length ? (
                <TouchableOpacity onPress={toProfile}>
                  {!image || image === '/images/default_avatar.jpg' ? (
                    <DefaultAvatar size="header" />
                  ) : (
                    <ImageComponent
                      size="header"
                      source={{ uri: `https://seruniverse.asmo.media${image}` }}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <CheckGreyIcon
                  size={22}
                  noPaddingAll
                  right
                  onPress={this.addParticipants}
                />
              )}
            </>
          ) : (
            <CloseIcon onPress={this.stopSearch} />
          )}
        </Right>
      </Header>
    )
  }

  state = {
    search: false,
    input: '',
  }

  componentDidMount() {
    this.props.valueChange.clearInput = () => {
      this.stopSearch()
    }
  }

  handleInputChange = e => {
    if (this.props.valueChange.callback) {
      this.props.valueChange.callback(e)
    }
    this.setState({ input: e })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  startSearch = () => {
    this.setState({ search: true })
  }

  stopSearch = () => {
    this.setState({ search: false })
    this.clearInput()
  }

  clearInput = () => {
    this.handleInputChange('')
    this.setState({ input: '' })
  }

  addParticipants = () => {
    const { back } = this.props
    back()
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tasks: state.tasksReducer.tasks,
  participants: state.participantsReducer.dialog.participants,
})

const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
