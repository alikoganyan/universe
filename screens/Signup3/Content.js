import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import CheckBox from 'react-native-check-box';
import helper from '../../utils/helpers';
import Button from '../../common/Button';

const { Colors, fontSize } = helper;
const {
  lightGrey1, blue, blueDisabled, pink
} = Colors;
const Wrapper = styled(View)`
    padding: 0 5%;
    justify-content: center;
    flex-grow: 1;
    
`;
const Title = styled(Text)`
    width: 100%;
    margin-bottom: 30px;
    font-size: ${fontSize.large};
    text-align: center;
`;
const SubTitle = styled(Text)`
    width: 100%;
    color: ${({ error }) => (error ? pink : lightGrey1)};
    text-align: center;
    margin-bottom: 30px;
    font-size: ${fontSize.text};
`;
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
`;

const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 10px;
    ${({ style }) => style}
`;
const ButtonBox = styled(View)`
    align-self: center;
    justify-content: center;
    align-items: center;
`;
const Checkbox = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const CheckBoxLabel = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const LinkText = styled(Text)`
    color: ${blue};
`;
class Content extends Component {
  render() {
    const { btnDisabled, agreements } = this.state;
    return (
      <Wrapper>
        <Title>
            Регистрация
        </Title>
        <SubTitle error={btnDisabled}>
                    Примите пользовательские соглашения
        </SubTitle>
        <PhoneNumber>
          {agreements.map((e, i) => (
            <Checkbox key={i}>
              <CheckBox
                checkBoxColor={blue}
                isChecked={e.value}
                onClick={() => this.setInputState(e)}
              />
              <CheckBoxLabel>
                <Text>
                  {e.label}
                  {' '}
                </Text>
                <TouchableOpacity>
                  <LinkText>{e.linkText}</LinkText>
                </TouchableOpacity>
              </CheckBoxLabel>
            </Checkbox>
          ))}
        </PhoneNumber>
        <ButtonBox>
          <Button
            onPress={this.proceed}
            background={!btnDisabled ? blue : blueDisabled}
            color="white"
          >
            зарегистрироваться
          </Button>
        </ButtonBox>
      </Wrapper>
    );
  }

    state = {
      btnDisabled: false,
      agreements: [
        {
          value: false,
          linkText: 'Условия использования',
          linkComp: 'linkComp',
          link: '',
        },
        {
          value: false,
          linkText: 'Пользовательское соглашение',
          linkComp: 'linkComp',
          link: '',
        },
        {
          value: false,
          linkText: 'Соглашение об Использовании персональных данных',
          linkComp: 'linkComp',
          link: '',
        }
      ]
    }

    componentDidMount() {
    }

    setInputState = (e) => {
      const { agreements } = this.state;
      const newAgreements = [...agreements];
      const item = newAgreements.filter(item => e.linkText === item.linkText)[0];
      item.value = !item.value;
      this.setState({ agreements: [...newAgreements], btnDisabled: false });
    }

    proceed = () => {
      const { agreements } = this.state;
      const checked = !agreements.filter(e => e.value === false)[0];
      this.setState({ btnDisabled: !checked });
      if (checked) {
        const { forward } = this.props;
        forward();
      }
    }
}
const mapStateToProps = state => ({
  id: state.userReducer.id,
  register: state.userReducer.register
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
