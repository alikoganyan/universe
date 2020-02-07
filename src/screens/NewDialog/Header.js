import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SearchIcon, BackIcon, CloseIcon } from '../../assets/index'
import { setDialogs } from '../../actions/dialogsActions'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import helper from '../../utils/helpers'
import { setIsMyProfile } from '../../actions/profileAction'
const { Colors, sidePadding, fontSize, HeaderHeight } = helper
const { grey3 } = Colors

const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  background-color: ${Colors.background};
  border-radius: 3;
  font-size: ${fontSize.header};
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 2;
  left: ${sidePadding}px;
`

const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

const Input = styled(TextInput)`
  margin-left: ${Dimensions.get('window').width * 0.085};
`

const HeaderText = styled(Text)`
  font-size: ${fontSize.header};
  position: relative;
  left: -10px;
  color: ${grey3};
`

const Right = styled(Left)`
  justify-content: flex-end;
`

class HeaderComponent extends Component {
  render() {
    const { search, input } = this.state
    const { user, toProfile, back } = this.props
    return (
      <Header>
        <Left>
          {!search ? (
            <>
              <BackIcon onPress={back} right />
              <HeaderText>Новый диалог</HeaderText>
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
              <TouchableOpacity
                onPress={() => {
                  this.props.setIsMyProfile(true)
                  toProfile()
                }}
              >
                {!user.image ||
                user.image === '/images/default_group.png' ||
                user.image === '/images/default_avatar.jpg' ? (
                  <DefaultAvatar size="header" />
                ) : (
                  <ImageComponent
                    source={{
                      uri: `https://seruniverse.asmo.media${user.image}`,
                    }}
                    size="header"
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
}

const mapStateToProps = state => ({
  dialogs: state.dialogsReducer.dialogs,
  messages: state.messageReducer.messages,
  search: state.messageReducer.search,
  drawer: state.drawerReducer.open,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setDialogs: _ => dispatch(setDialogs(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
