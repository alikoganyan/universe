import React, { PureComponent } from 'react'
import { View, TextInput, Dimensions, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { CloseIcon, SearchIconGray } from '../../assets/index'
import { setDialogs } from '../../actions/dialogsActions'
import sendRequest from '../../utils/request'
import { p_search_dialogs } from '../../constants/api'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'

const { sidePadding, fontSize, HeaderHeight } = helper

const Wrapper = styled(View)`
  border-bottom-color: #e8ebee;
  border-bottom-width: 1px;
  padding-bottom: 12px;
  margin-bottom: 13px;
`
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  background-color: #f4f4f4;
  border-radius: 10px;
  font-size: ${fontSize.header};
  height: 37px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  z-index: 1;
  left: ${sidePadding}px;
  margin-top: 3px;
`
const Input = styled(TextInput)`
  flex: 1;
  height: ${HeaderHeight};
  position: relative;
  left: -4px;
  font-size: ${fontSize.input};
`

class HeaderComponent extends PureComponent {
  render() {
    const { input, focused } = this.state
    return (
      <Wrapper>
        <Header>
          <SearchIconGray />
          <Input
            value={input}
            onChangeText={this.handleInputChange}
            onFocus={this.handleFocus}
            placeholder="Поиск"
            editable={false}
          />
          {focused && (
            <CloseIcon
              onPress={this.onBlur}
              marginLeft={false}
              marginRight
              right
            />
          )}
        </Header>
      </Wrapper>
    )
  }

  state = {
    input: '',
    focused: false,
  }

  componentDidMount() {
    const { setDialogs } = this.props
    socket.on('find', ({ result }) => {
      setDialogs(result)
    })
  }

  handleInputChange = e => {
    const { user, setDialogs } = this.props
    this.setState({ input: e })
    if (e && e.length > 1) {
      sendRequest({
        r_path: p_search_dialogs,
        method: 'post',
        attr: {
          name: e,
        },
        success: res => {
          const { dialogs, groups } = res
          const newDialogs = [...dialogs, ...groups]
          setDialogs(newDialogs)
        },
        failFunc: err => {},
      })
    } else {
      socket.emit('get_dialogs', { id: user._id })
    }
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    const { user } = this.props
    this.setState({ focused: false, input: '' })
    socket.emit('dialogs', { userId: user._id })
    socket.emit('get_dialogs', { id: user._id })
    Keyboard.dismiss()
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
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
