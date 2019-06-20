import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components';
import { PapperPlaneIcon, GroupIcon, FeedIcon, TasksIcon, SettingsIcon, DialogsIcon } from '../../assets/';
import { DrawerActions } from 'react-navigation-drawer';
import helper from '../../utils/helpers';
const { sidePadding, topPadding, fontSize } = helper;
const Wrapper = styled(View)`
    flex: 7;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    padding-left: 40px;
`;
const Content = styled(View)`
`;

const Link = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: ${topPadding} ${sidePadding}px;
    padding-left: 0;
    width: 100%;
    height: 55px;
`;
const LinkText = styled(Text)`
    margin-left: 15px;
    color: #4d4d4d;
    font-size: ${fontSize.header};
`;
export default function ContentComponent(props) {
    const { navigate, dispatch } = props;
    return (
        <Wrapper>
            <Content>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('Dialogs');
                }}>
                    <DialogsIcon size={20} />
                    <LinkText>
                        Диалоги
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('NewDialog');
                }}>
                    <PapperPlaneIcon size={20} />
                    <LinkText>
                        Новый диалог
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('ContactGroups');
                }}>
                    <GroupIcon noPadding={true} size={20} />
                    <LinkText>
                        Контакты
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('News');
                }}>
                    <FeedIcon size={20} />
                    <LinkText>
                        Новости
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('TasksList');
                }}>
                    <TasksIcon size={20} noPaddingAll={false} />
                    <LinkText>
                        Задачи
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer());
                    navigate('Settings');
                }}>
                    <SettingsIcon size={20} />
                    <LinkText>
                        Настройки
                    </LinkText>
                </Link>
            </Content>
        </Wrapper>
    );
}
