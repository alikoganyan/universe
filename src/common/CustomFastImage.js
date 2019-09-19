import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import helper from '../utils/helpers'

const { Colors } = helper

export default class CustomFastImage extends Component {
  static propTypes = {
    enableLoadingIndicator: PropTypes.bool,
    activityIndicatorColor: PropTypes.string,
    activityIndicatorSize: PropTypes.string,
  }
  static defaultProps = {
    enableLoadingIndicator: true,
    activityIndicatorColor: Colors.white,
    activityIndicatorSize: 'large',
  }

  render() {
    const {
      enableLoadingIndicator,
      activityIndicatorColor,
      activityIndicatorSize,
      ...props
    } = this.props
    if (enableLoadingIndicator) {
      return (
        <View style={[styles.wrapper, props.style && props.style]}>
          <ActivityIndicator
            style={styles.indicator}
            animating
            color={activityIndicatorColor}
            size={activityIndicatorSize}
          />
          <FastImage {...props} style={styles.image} />
        </View>
      )
    } else {
      return <FastImage {...props} style={styles.image} />
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
