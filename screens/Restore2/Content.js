import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, TextInput
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import helper from '../../utils/helpers';
import { setRegisterUserSms } from '../../actions/userActions';
import Button from '../../common/Button';
import { p_check_restore_password } from '../../constants/api';
import sendRequest from '../../utils/request';

const { Colors } = helper;
const {
  blue, grey1, lightGrey1, pink, black
} = Colors;
const Wrapper = styled(View)`
    flex: 1;
    padding: 0 20%;
    padding-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Title = styled(Text)`
    width: 100%;
    font-size: 18px;
    text-align: center;
    margin-bottom: 20px;
`;
const ControlBar = styled(View)`
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
`;
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
`;
const Label = styled(Title)`
    font-size: 13px;
    color: ${grey1};
    margin-bottom: 0px;
`;
const NoCode = styled(View)`
    display: flex;
    justify-content: center;
`;
const NoCodeLabel = styled(Text)`
    font-size: 11px;
    color: ${grey1};
    text-align: center;
`;
const NoCodeLabelLink = styled(NoCodeLabel)`
    color: ${blue};
`;
const NoCodeTimer = styled(Text)`
    font-size: 11px;
    text-align: center;
`;
const StyledInput = styled(TextInput)`
    border-width: 0;
    border-bottom-width: 1;
    border-bottom-color: ${lightGrey1};
    display: flex;
    text-align: center;
    padding-left: 0;
    width: 100%;
    padding-bottom: 10px;
`;
class Content extends Component {
  render() {
    const { code, error, deadline } = this.state;
    return (
      <Wrapper>
        <Title>
                    Восстановление пароля
        </Title>
        <Label>
Вам отправлено sms с временным паролем,
          {'\n'}
введите его тут
        </Label>
        <PhoneNumber>
          <StyledInput
            autoFocus
            style={{ color: error ? pink : black, borderBottomColor: error ? pink : lightGrey1 }}
            value={code}
            maxLength={6}
            onChangeText={this.handleChangeCode}
            keyboardType="phone-pad"
          />
        </PhoneNumber>
        <ControlBar>
          {(this.state.code.length === 6 && !error) ? <Button onPress={this.proceed} background={blue} color="#fff">Отправить</Button>
            : (
              <NoCode>
                {error
                                && (
                                <TouchableOpacity onPress={this.sendAgain}>
                                  <NoCodeLabel>
Неверный пароль,
                                    <NoCodeLabelLink>отправить sms повторно?</NoCodeLabelLink>
                                  </NoCodeLabel>
                                </TouchableOpacity>
                                )}
                {(deadline > 0 && !error) && (
                <NoCodeTimer>
Отправить sms повторно можно будет через 0:
                  {deadline >= 10 ? deadline : `0${deadline}`}
                </NoCodeTimer>
                )}
                {(deadline === 0 && !error) && <TouchableOpacity onPress={this.sendAgain}><NoCodeLabelLink>Отправить sms повторно</NoCodeLabelLink></TouchableOpacity>}
              </NoCode>
            )}
        </ControlBar>
      </Wrapper>
    );
  }

    state = {
      error: false,
      code: '',
      deadline: 2,
    }

    componentDidMount() {
      const countdown = setInterval(() => {
        const { deadline } = this.state;
        this.setState({ deadline: deadline - 1 });
        if (deadline === 0) clearInterval(countdown);
      }, 1000);
    }

    handleChangeCode = (e) => {
      this.setState({ code: e, error: false });
    }

    proceed = () => {
      const { code } = this.state;
      if (code.length === 6) {
        this.checkCode();
      } else {
        this.setState({ error: true });
      }
    }

    checkCode = () => {
      const { navigate, register, setSms } = this.props;
      const { code } = this.state;
      const phone_number = register.phone;
      setSms(code);
      sendRequest({
        r_path: p_check_restore_password,
        method: 'post',
        attr: {
          phone_number,
          password: code,
        },
        success: (res) => {
          navigate('Restore3');
        },
        failFunc: (err) => {
          console.log(err);
          this.setState({ error: true });
        }
      });
    }

    sendAgain = () => {
      this.setState({ deadline: 30 }, () => {
        const { deadline } = this.state;
        this.checkCode();
        const countdown = setInterval(() => {
          this.setState({ deadline: deadline - 1 });
          if (deadline === 0) clearInterval(countdown);
        }, 1000);
      });
    }
}
const mapStateToProps = state => ({
  register: state.userReducer.register,
});
const mapDispatchToProps = dispatch => ({
  setSms: _ => dispatch(setRegisterUserSms(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
