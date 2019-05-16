import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { PapperPlaneIcon, GroupIcon, FeedIcon, TasksIcon, SettingsIcon, DialogsIcon } from '../../assets/'
import { DrawerActions } from 'react-navigation-drawer';
import helper from '../../utils/helpers'
const { sidePaddingNumber, topPadding } = helper;
const Wrapper = styled(View)`
    flex: 7;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    
`
const Content = styled(View)``

const Link = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: ${topPadding} ${sidePaddingNumber}px;
    width: 100%;
`
const LinkText = styled(Text)`
    margin-left: 15px;
    color: #4d4d4d;
`
export default function ContentComponent(props) {
    const { navigate, dispatch } = props
    return (
        <Wrapper>
            <Content>
            <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('Dialogs')
                }}>
                    <DialogsIcon />
                    <LinkText>
                        Диалоги
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('NewDialog')
                }}>
                    <PapperPlaneIcon />
                    <LinkText>
                        Новый диалог
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('ContactGroups')
                }}>
                    <GroupIcon noPadding={true} />
                    <LinkText>
                        Контакты
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('News')
                }}>
                    <FeedIcon />
                    <LinkText>
                        Новости
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('TasksList')
                }}>
                    <TasksIcon />
                    <LinkText>
                        Задачи
                    </LinkText>
                </Link>
                <Link onPress={() => {
                    dispatch(DrawerActions.closeDrawer())
                    navigate('Settings')
                }}>
                    <SettingsIcon />
                    <LinkText>
                        Настройки
                    </LinkText>
                </Link>
            </Content>
        </Wrapper>
    )
}
