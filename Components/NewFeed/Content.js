import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../Common'
import { ImageComponent } from '../../Common'
import { GroupIcon, CloseIcon } from '../../assets/'
const { Colors, HeaderHeightNumber, socket, sidePadding } = helper;
const { lightGrey1, black, yellow } = Colors;
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
    const { info, title, image } = children
    return <Reciever last={last}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ImageComponent source={{ uri: image }} />
            <View style={{ flex: 1 }}>
                <RecieverInfo>
                    <Text numberOfLines={1}>{title}</Text>
                    <Department numberOfLines={1}>{info}</Department>
                </RecieverInfo>
            </View>
            <CloseIcon />
        </View>
    </Reciever>
}
class Content extends Component {
    render() {
        const {
            country,
            phone
        } = this.state
        return (
            <Wrapper>
                <StyledInput password={true}
                    onChangeText={this.handlePhone}
                    value={phone}
                    placeholder={'Текст новости'}
                    multiline={true}
                    style={{ margin: 0, textAlign: 'left', paddingLeft: 10, maxHeight: 130 }}
                />
                <Recievers>
                    <DialogsLabel>
                        <GroupIcon />
                        <Text>диалоги</Text>
                    </DialogsLabel>
                    <ScrollView>
                        {
                            this.state.recievers.map((e, i) => (
                                <RecieverComponent key={i} last={i === this.state.recievers.length}>{e}</RecieverComponent>
                            ))
                        }
                    </ScrollView>
                    <DialogsLabel>
                        <TouchableOpacity>
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
            </Wrapper>
        )
    }
    state = {
        country: '+7',
        phone: '',
        recievers: [
            {
                id: 0,
                image: 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
                info: 'менеджер по продажам',
                title: 'Константи константинопольский'
            },
            {
                id: 1,
                image: 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
                info: 'ме',
                title: 'Ко'
            },
            {
                id: 2,
                image: 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
                info: 'менеджер по продажам',
                title: 'Константи константинопольский'
            }
        ]
    }
    componentDidMount() {
        socket.on('user exists', e => {
            console.log(e)
        })
        socket.on('user created', e => {
            this.props.forward()
        })

    }
    proceed = (e) => {

        const { country, phone, recievers } = this.state;
        let idList = []
        recievers.map((e) => {
            idList = [...idList, e.id]
        })
        console.log(idList)
        country && phone && socket.emit('new user', {
            "phone": country + phone
        })

    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handlePhone = (e) => {
        this.setState({ phone: e })
    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.id
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)