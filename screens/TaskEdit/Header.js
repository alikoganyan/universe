import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  CloseIcon
} from '../../assets/index';
import helper from '../../utils/helpers';

const { sidePadding, HeaderHeight, fontSize } = helper;

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
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePadding}px;
// `

const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
`;
class HeaderComponent extends Component {
  render() {
    const { user } = this.props;
    return (
      <Header>
        <Left>
          <CloseIcon onPress={this.back} right />
          <HeaderText>Редактировать задачу</HeaderText>
        </Left>
      </Header>
    );
  }

    state = {
      search: false,
      find: ''
    };

    find = () => {};

    startSearch = () => {
      this.setState({ search: true });
    };

    stopSearch = () => {
      this.setState({ search: false });
    };

    addTask = () => {
      const { navigate } = this.props;
      navigate('NewTask');
    };

    back = () => {
      const { back } = this.props;
      back();
    };

    editTask = () => {
      const { navigate } = this.props;
      navigate('TaskEdit');
    }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tasks: state.tasksReducer.tasks,
});
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
