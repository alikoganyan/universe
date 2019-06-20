import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { connect } from 'react-redux';
import { setFeed } from '../../actions/newsActions';
import { p_send_file, p_news_add_comment } from '../../constants/api';
import sendRequest from '../../utils/request';
import posed from 'react-native-pose';
import { socket } from '../../utils/socket';
const { sidePadding, borderRadius, HeaderHeight, Colors } = helper;
const { orange, grey2 } = Colors;
const FilePickerPosed = posed.View({
    visible: { bottom: 10 },
    hidden: { bottom: -250 }
});
const Wrapper = styled(View)`
    background: white;
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    left: 0;
    bottom: 10px;
    align-self: center;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5;
    border-width: 1;
    border-color: ${orange};
    border-bottom-width: 1;
`;
const Input = styled(TextInput)`
    font-size: 15px;
    height: 30px;
    display: flex;
    flex-direction: column;
    width: 85%;
    z-index: 50;
    overflow: hidden;
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
`;
const FilePicker = styled(FilePickerPosed)`
    background: white;
    width: 94%;
    height: ${Dimensions.get('window').height * 0.3}px;
    position: absolute;
    margin: 0 3%;
    padding: 2% 7%;
    bottom: 10px;
    border-radius: ${borderRadius};
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    z-index: 4;
`;
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${Dimensions.get('window').height - HeaderHeight - 3};
    z-index: 2;
`;
class InputComponent extends Component {
    render() {
        const { text, pickerOpened } = this.state;
        return (
            <>
                {pickerOpened && <Shadow activeOpacity={1} onPress={this.unselect} />}
                <Wrapper>
                    <Left>
                        <Input
                            placeholder='Написать сообщение'
                            onChangeText={e => this.handleChange(e)}
                            onSubmitEditing={this.sendMessage}
                            value={text}
                            blurOnSubmit={false}
                            placeholderTextColor={grey2}
                        />
                    </Left>
                </Wrapper>
                <FilePicker pose={pickerOpened ? 'visible' : 'hidden'}>
                    <TouchableOpacity onPress={this.selectPhoto}><Text>Фото или видео</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.selectFile}><Text>Файл</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.selectGeo}><Text>Мою локацию</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.unselect}><Text>Отменить</Text></TouchableOpacity>
                </FilePicker>
            </>
        );
    }
    state = {
        text: '',
        height: 0,
        image: null,
        pickerOpened: false,
    }
    componentDidMount() {
    }
    unselect = () => {
        this.setState({ pickerOpened: false });
    }
    selectPhoto = async () => {
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     allowsEditing: false,
        // });
    }
    selectFile = async () => {
        // let result = await DocumentPicker.getDocumentAsync({});
    }
    selectGeo = () => { }
    discardSelect = () => { }
    sendMessage = () => {
        const { user, addComment, feed } = this.props;
        const { text } = this.state;
        if (text) {
            const newFeed = feed;
            newFeed.comments = [...newFeed.comments, {
                text,
                likes: [],
                type: "text",
                likes_сount: 0,
                creator: {
                    first_name: user.first_name,
                    image: user.image,
                    _id: user._id,
                },
                news: 0,
                created_at: new Date(),
                updated_at: new Date(),
            }];
            addComment(newFeed);
            sendRequest({
                r_path: p_news_add_comment,
                method: 'post',
                attr: {
                    news_id: feed._id,
                    text
                },
                success: (res) => {
                    console.log({ res });
                },
                failFunc: (err) => {
                    console.log({ err });
                }
            });
            this.setState({ text: '' });
        }
    }
    handleChange = (e) => {
        this.setState({ text: e });
    }
    pickImage = async () => {
        // const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { currentRoom } = this.props;
        this.setState({ pickerOpened: true });
        const form = new FormData();
        form.append("photo", { uri: 'result.uri', name: 'image', type: 'image/jpeg' });
        if (!result.cancelled) {
            sendRequest({
                r_path: p_send_file,
                method: 'post',
                attr: {
                    file: form,
                    room: '0_1'
                },
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                },
                success: (res) => {
                    console.log({ res });
                    socket.emit('file', { room: currentRoom });
                },
                failFunc: (err) => {
                    console.log({ err });
                }
            });
        }
    };
}

const mapStateToProps = state => ({
    messages: state.messageReducer.messages,
    currentRoom: state.messageReducer.currentRoom,
    id: state.userReducer.user._id,
    user: state.userReducer.user,
    feed: state.newsReducer.feed
});
const mapDispatchToProps = dispatch => ({
    addComment: _ => dispatch(setFeed(_)),
    startSearch: _ => dispatch(startSearch(_)),
    stopSearch: _ => dispatch(stopSearch(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent);
