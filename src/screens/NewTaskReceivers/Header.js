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

const { sidePadding, HeaderHeight, fontSize } = helper
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
`
class HeaderComponent extends Component {
  render() {
    const { back, user, toProfile, receivers } = this.props
    const { search, input } = this.state
    const { image } = user
    return (
      <Header>
        <Left>
          {!search ? (
            <>
              <BackIcon onPress={back} right />
              <HeaderText>Добавить исполнителя</HeaderText>
            </>
          ) : (
            <>
              <SearchIcon />
              <Input
                value={input}
                onChangeText={this.handleInputChange}
                onFocus={this.handleFocus}
                placeholder="Поиск"
                autoFocus
              />
            </>
          )}
        </Left>
        <Right>
          {!search ? (
            <>
              <SearchIcon right onPress={this.startSearch} />
              <TouchableOpacity onPress={toProfile}>
                {!receivers.length ? (
                  <TouchableOpacity onPress={toProfile}>
                    <ImageComponent
                      source={{ uri: `https://seruniverse.asmo.media${image}` }}
                      size="header"
                    />
                  </TouchableOpacity>
                ) : (
                  <CheckGreyIcon
                    size={22}
                    noPaddingAll
                    left
                    onPress={this.addParticipants}
                  />
                )}
              </TouchableOpacity>
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
  receivers: state.participantsReducer.tasks.receivers,
})
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
