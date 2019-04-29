import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../common'
import { ImageComponent } from '../../common'
import { GroupIcon, CloseIcon } from '../../assets/'
import { socket } from '../../utils/socket'
const { Colors, HeaderHeightNumber, sidePadding } = helper;
const { lightGrey1, black, green } = Colors;
const Wrapper = styled(View)`
    padding: 0 ${sidePadding};
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
    margin: 40px 0;
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
    color: ${green};
`
const RecieverComponent = (props) => {
    const { children, last = false } = props;
    const { info, title, image, role, first_name, last_name, phone_number } = children
    return <Reciever last={last}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ImageComponent source={{ uri: image }} />
            <View style={{ flex: 1 }}>
                <RecieverInfo>
                    <Text numberOfLines={1}>{first_name || phone_number}</Text>
                    <Department numberOfLines={1}>{role || 'no role'}</Department>
                </RecieverInfo>
            </View>
            <CloseIcon />
        </View>
    </Reciever>
}
class Content extends Component {
    render() {
        const {
            text
        } = this.state
        const { participants } = this.props
        console.log(participants)
        return (
            <Wrapper>
                <ImageComponent style={{ alignSelf: 'center', marginBottom: 20 }} size={70} source={{ uri: 'http://simpleicon.com/wp-content/uploads/user1.png' }} />
                <StyledInput password={true}
                    onChangeText={this.handleChange}
                    value={text}
                    placeholder={'Новая группа'}
                    multiline={true}
                    style={{ margin: 0, textAlign: 'left', paddingLeft: 10, maxHeight: 130 }} />
                <Recievers>
                    <DialogsLabel>
                        <GroupIcon />
                        <Text>Участники</Text>
                    </DialogsLabel>
                    <ScrollView style={{ maxHeight: 150 }}>
                        {participants.map((e, i) => (
                            <RecieverComponent key={i} last={i === participants.length}>{e}</RecieverComponent>
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
                        style={{ background: green }}
                        color={black}>Продолжить</Button>
                </ButtonBox>
            </Wrapper>)
    }
    state = {
        text: ''
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
        const { participants } = this.props;
        const { text } = this.state
        let idList = []
        participants.map((e) => {
            idList = [...idList, e._id]
        })
        socket.emit('new_group', { name: text, participants: idList })
    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.user.id,
        participants: state.participantsReducer.dialog.participants
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)