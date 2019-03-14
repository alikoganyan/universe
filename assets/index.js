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
    ${({ style }) => style}
`
const Right = styled(StyledTouchableOpacity)`
    margin-left: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
    ${({ style }) => style}
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
const LeftWrapper = function (props) {
    const { children, onPress } = props;
    return (
        <Left style={{ ...props.style }} onPress={props.props.onPress} noPadding={props.noPadding}>
            <Text>
                {children}
            </Text>
        </Left>
    )
}
const RightWrapper = function (props) {
    const { children } = props;
    return (
        <Right style={{ ...props.style }} onPress={props.props.onPress} noPadding={props.noPadding}>
            <Text>
                {children}
            </Text>
        </Right>
    )
}
export function BackIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="angle-left" size={IconSizeLarge} color={IconDarkColor} />
        </LeftWrapper >
    )
}

export function ForwardIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="angle-right" size={IconSize} color={IconDarkColor} />
        </LeftWrapper >
    )
}


export function EllipsisVIcon(props) {
    return (
        <RightWrapper props={props}>

            <Icon name="ellipsis-v" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}


export function SmileIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="smile-o" size={IconSize} color={IconDarkColor} />

        </LeftWrapper>
    )
}

export function FileIcon(props) {
    return (
        <RightWrapper props={props}>


            <Icon name="file" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}

export function CameraIcon(props) {
    return (
        <RightWrapper props={props}>


            <Icon name="camera" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}


export function BurgerIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="bars" size={IconSize} color={IconLightColor} />

        </LeftWrapper>
    )
}

export function SearchIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="search" size={IconSize} color={IconDarkColor} />

        </LeftWrapper>
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
        <RightWrapper props={props}>


            <Icon name="map-marker" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}

export function ImageIcon(props) {
    return (
        <RightWrapper props={props}>


            <Icon name="file-photo-o" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}

export function MessageIndicatorIcon(props) {
    return (
        <Text>
            <Icon name="check" size={IconSize} color={IconDarkColor} />
        </Text>
    )
}


export function EditIcon(props) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <Icon name="pencil" size={IconSize} color={IconDarkColor} />
        </TouchableOpacity>
    )
}


export function FunnelIcon(props) {
    return (
        <LeftWrapper props={props}>
            <Ionicons name="ios-funnel" size={IconSize} color={IconDarkColor} />
        </LeftWrapper>
    )
}
export function HeartIcon(props) {
    return (
        <RightWrapper props={props}>
            <Icon name="heart-o" size={IconSize} color={props.color || IconBlueColor} />
        </RightWrapper>
    )
}

export function CommentIcon(props) {
    return (
        <RightWrapper props={props}>
            <Icon name="comment-o" size={IconSize} color={props.color || IconBlueColor} />
        </RightWrapper>
    )
}

export function CloseIcon(props) {
    return (
        <RightWrapper props={props}>
            <Icon name="close" size={IconSize} color={IconDarkColor} />
        </RightWrapper>
    )
}

export function GroupIcon(props) {
    return (
        <View onPress={props.onPress} noPadding={props.noPadding}>
            <Icon name="group" size={IconSize} color={props.color || IconDarkColor} />
        </View>
    )
}

export function TaskIcon(props) {
    return (
        <RightWrapper props={props}>
            <Icon name="tasks" size={IconSize} color={IconDarkColor} />
        </RightWrapper>
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
export function PapperPlaneIcon(props) {
    return (
        <View>
            <Icon name="paper-plane" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function FeedIcon(props) {
    return (
        <View>
            <Icon name="newspaper-o" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function TasksIcon(props) {
    return (
        <View>
            <Icon name="tasks" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function SettingsIcon(props) {
    return (
        <View>
            <Ionicons name="ios-settings" size={IconSize} color={IconDarkColor} />
        </View>
    )
}
export function AddIcon(props) {
    return (
        <View>
            <Ionicons name="md-add" size={IconSizeLarge} color={IconDarkColor} />
        </View>
    )
}

export function ArrowDownIcon(props) {
    return (
        <Icon name="angle-down" size={IconSizeLarge} color={IconDarkColor} />
    )
}