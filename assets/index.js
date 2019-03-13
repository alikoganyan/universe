import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components'
import helper from '../Helper/helper'
const { IconDarkColor,
    IconLightColor,
    IconBlueColor,
    IconSize,
    IconSizeLarge } = helper;

const StyledTouchableOpacity = styled(TouchableOpacity)`
    padding: 2px 10px;
`
const Left = styled(StyledTouchableOpacity)`
    margin-right: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
`
const Right = styled(StyledTouchableOpacity)`
    margin-left: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
`
// ${({ color }) => color || IconLightColor}
const TriangleLeft = styled(View)`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0;
    border-top-width: 15px;
    border-left-width: 15px;
    border-color: transparent;
    border-left-color: ${({ color }) => color || IconLightColor};
    position: relative;
    align-self: flex-end;
    left: -15px;
    top: -5px;
    line-height: 0px;
    ${({ style }) => style};
`
const TriangleLeftInner = styled(TriangleLeft)`
`

const TriangleRight = styled(View)`
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0;
    border-left-width: 15px;
    border-bottom-width: 15px;
    border-color: transparent;
    border-bottom-color: ${({ color }) => color || IconLightColor};    
    position: relative;
    align-self: flex-end;
    left: 5px;
    top: -5px;
    line-height: 0px;
    ${({ style }) => style};
`
const TriangleRightInner = styled(TriangleRight)`
`
export function BackIcon(props) {
    return (
        <Left onPress={props.onPress}>
            <Text>
                <Icon name="angle-left" size={IconSizeLarge} color={IconDarkColor} />
            </Text>
        </Left>
    )
}

export function ForwardIcon(props) {
    return (
        <Left onPress={props.onPress}>
            <Text>
                <Icon name="angle-right" size={IconSize} color={IconDarkColor} />
            </Text>
        </Left>
    )
}


export function EllipsisVIcon(props) {
    return (
        <Right onPress={props.onPress}>
            <Text>
                <Icon name="ellipsis-v" size={IconSize} color={IconDarkColor} />
            </Text>
        </Right>
    )
}


export function SmileIcon(props) {
    return (
        <Left onPress={console.log()}>
            <Text>
                <Icon name="smile-o" size={IconSize} color={IconDarkColor} />
            </Text>
        </Left>
    )
}

export function FileIcon(props) {
    return (
        <Right>
            <Text>
                <Icon name="file" size={IconSize} color={IconDarkColor} />
            </Text>
        </Right>
    )
}

export function CameraIcon(props) {
    return (
        <Right>
            <Text>
                <Icon name="camera" size={IconSize} color={IconDarkColor} />
            </Text>
        </Right>
    )
}


export function BurgerIcon({ onPress }) {
    return (
        <Left onPress={onPress}>
            <Text>
                {/* <Icon name="bars" size={IconSize} color={IconLightColor} /> */}
            </Text>
        </Left>
    )
}

export function SearchIcon({ onPress }) {
    return (
        <Left onPress={onPress}>
            <Text>
                <Icon name="search" size={IconSize} color={IconDarkColor} />
            </Text>
        </Left>
    )
}


export function TriangleLeftIcon({ color, style, hollow }) {
    return (
        <TriangleLeft color={color || IconDarkColor} style={{ ...style }}>
            {hollow && <TriangleLeftInner color={'#fff'} style={{
                ...style,
                position: 'relative',
                borderRightWidth: 15,
                borderTopWidth: 15,
                top: -16,
                left: 12.5,
            }} />}
        </TriangleLeft>
    )
}

export function TriangleRightIcon({ color, style, hollow }) {
    return (
        <TriangleRight color={color || IconDarkColor} style={{ ...style }}>
            {hollow && <TriangleRightInner color={'#fff'} style={{
                ...style,
                position: 'relative',
                borderLeftWidth: 15,
                borderBottomWidth: 15,
                top: -1,
                left: 2,
            }} />}
        </TriangleRight>
    )
}

export function LocationIcon(props) {
    return (
        <Right>
            <Text>
                <Icon name="map-marker" size={IconSize} color={IconDarkColor} />
            </Text>
        </Right>
    )
}

export function ImageIcon(props) {
    return (
        <Right>
            <Text>
                <Icon name="file-photo-o" size={IconSize} color={IconDarkColor} />
            </Text>
        </Right>
    )
}

export function MessageIndicatorIcon(props) {
    return (
        <Text>
            <Icon name="check" size={IconSize} color={IconDarkColor} />
        </Text>
    )
}


export function EditIcon({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name="pencil" size={IconSize} color={IconDarkColor} />
        </TouchableOpacity>
    )
}


export function FunnelIcon({ onPress }) {
    return (
        <Left onPress={onPress}>
            <Ionicons name="ios-funnel" size={IconSize} color={IconDarkColor} />
        </Left>
    )
}

export function HeartIcon({ onPress, color }) {
    return (
        <Right onPress={onPress}>
            <Icon name="heart-o" size={IconSize} color={color || IconBlueColor} />
        </Right>
    )
}

export function CommentIcon({ onPress, color }) {
    return (
        <Right onPress={onPress}>
            <Icon name="comment-o" size={IconSize} color={color || IconBlueColor} />
        </Right>
    )
}

export function CloseIcon({ onPress }) {
    return (
        <Right onPress={onPress}>
            <Icon name="close" size={IconSize} color={IconDarkColor} />
        </Right>
    )
}

export function GroupIcon({ onPress, noPadding, color }) {
    return (
        <View onPress={onPress} noPadding={noPadding}>
            <Icon name="group" size={IconSize} color={color || IconDarkColor} />
        </View>
    )
}

export function TaskIcon({ onPress }) {
    return (
        <Right onPress={onPress}>
            <Icon name="tasks" size={IconSize} color={IconDarkColor} />
        </Right>
    )
}

export function CheckIcon({ onPress, color }) {
    return (
        <View style={{ marginLeft: 5 }}>
            <Ionicons name="md-checkmark" size={IconSize} color={color || IconDarkColor} />
        </View>
    )
}

export function CheckAllIcon({ onPress, color }) {
    return (
        <View>
            <Ionicons name="md-done-all" size={IconSize} color={color || IconDarkColor} />
        </View>
    )
}
export function PapperPlaneIcon({ onPress }) {
    return (
        <View>
            <Icon name="paper-plane" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function FeedIcon({ onPress }) {
    return (
        <View>
            <Icon name="newspaper-o" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function TasksIcon({ onPress }) {
    return (
        <View>
            <Icon name="tasks" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function SettingsIcon({ onPress }) {
    return (
        <View>
            <Ionicons name="ios-settings" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function AddIcon({ onPress }) {
    return (
        <View>
            <Ionicons name="md-add" size={IconSizeLarge} color={IconDarkColor} />
        </View>
    )
}

export function ArrowDownIcon({ onPress }) {
    return (
        <Icon name="angle-down" size={IconSizeLarge} color={IconDarkColor} />
    )
}