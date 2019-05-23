import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../common'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import { ImageComponent } from '../../common'
import { GroupIcon, CloseIcon } from '../../assets/'
const { Colors, HeaderHeight, sidePadding } = helper;
const { lightGrey1, black, yellow } = Colors;
const Wrapper = styled(View)`
    padding: 0 ${sidePadding}px;
    justify-content: center;
    flex-grow: 1;
    height: 100%;
`

const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 50px;
    ${({ style }) => style}
`
const ButtonBox = styled(View)`
    width: 170px;
    align-self: center;
    position: absolute;
    bottom: 30px;
`
const Recievers = styled(View)`
    margin: 60px 0;
`
const Reciever = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    
`
const RecieverInfo = styled(View)`
    display: flex;
    justify-content: space-between;
`
const Department = styled(Text)`
    color: ${lightGrey1};
`
const DialogsLabel = styled(View)`
    display: flex;
    align-items: center;
    flex-direction:row;
    justify-content: flex-start;
    margin-top: 20px;
`
const AddReciever = styled(Text)`
    color: ${yellow};
`
const RecieverComponent = (props) => {
    const { children, last = false } = props;
    const { image, first_name, last_name, phone_number, department } = children
    return <Reciever last={last}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <RecieverInfo>
                    <Text numberOfLines={1}>{first_name ? `${first_name} ${last_name}` : phone_number}</Text>
                    <Department numberOfLines={1}>{department || 'без департамента'}</Department>
                </RecieverInfo>
            </View>
            <CloseIcon onPress={undefined} />
        </View>
    </Reciever>
}
class Content extends Component {
    render() {
        const {
            text
        } = this.state
        const {
            receivers
        } = this.props
        return (
            <Wrapper>
                <StyledInput password={true}
                    onChangeText={this.handleChange}
                    value={text}
                    placeholder={'Текст новости'}
                    multiline={true}
                    style={{ margin: 0, textAlign: 'left', paddingLeft: 10, maxHeight: 130 }} />
                <Recievers>
                    <DialogsLabel>
                        <GroupIcon />
                        <Text>диалоги</Text>
                    </DialogsLabel>
                    <ScrollView>
                        {receivers.map((e, i) => (
                            <RecieverComponent key={i} last={i === receivers.length}>{e}</RecieverComponent>
                        ))}
                    </ScrollView>
                    <DialogsLabel>
                        <TouchableOpacity onPress={this.addParticipant}>
                            <AddReciever>Добавить</AddReciever>
                        </TouchableOpacity>
                    </DialogsLabel>
                </Recievers>
                <ButtonBox>
                    <Button
                        onPress={this.proceed}
                        style={{ background: yellow }}
                        color={black}>Продолжить</Button>
                </ButtonBox>
            </Wrapper>)
    }
    state = {
        receivers: [],
        text: '',
        err: false
    }
    componentDidMount() {
    }
    componentWillUpdate() {

    }
    addParticipant = () => {
        const { addParticipant } = this.props
        addParticipant()
    }
    proceed = (e) => {
        const { id, receivers, forward } = this.props;
        const { text } = this.state;
        let idList = []
        receivers.map((e) => {
            idList = [...idList, e._id]
        })
        if (text && receivers.length) {
            sendRequest({
                r_path: p_news,
                method: 'post',
                attr: {
                    news: {
                        text,
                        receivers: idList
                    }
                },
                success: (res) => {
                    console.log({ res })
                    forward()
                },
                failFunc: (err) => {
                    console.log({ err })
                }
            })
        } else {
            this.setState({ err: true })
        }

    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
}
const mapStateToProps = state => ({
    id: state.userReducer.user.id,
    receivers: state.participantsReducer.news.receivers
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)