import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { RectButton, Swipeable } from 'react-native-gesture-handler';

export default class SwipeableButtons extends Component {
  constructor(props) {
    super(props);
    this._swipeableRow = null;
  }

  closeSwipeable = () => {
    if (this._swipeableRow) {
      this._swipeableRow.close();
    }
  };

  renderRightAction = (iconName, color, x, progress, onPress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={onPress}>
          <Icon name={iconName} size={20} color="white" />
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress) => {
    const {
      action1Icon,
      action1Color,
      action1X,
      action1OnPress,
      action2Icon,
      action2Color,
      action2X,
      action2OnPress,
      action3Icon,
      action3Color,
      action3X,
      action3OnPress,
    } = this.props;

    const rightActions = [];

    if (action1Icon && action1Color && action1X && action1OnPress) {
      rightActions.push(
        this.renderRightAction(action1Icon, action1Color, action1X, progress, () => {
          this.closeSwipeable(); // Fechar o slide de botões
          action1OnPress();
        })
      );
    }
    if (action2Icon && action2Color && action2X && action2OnPress) {
      rightActions.push(
        this.renderRightAction(action2Icon, action2Color, action2X, progress, () => {
          this.closeSwipeable(); // Fechar o slide de botões
          action2OnPress();
        })
      );
    }
    if (action3Icon && action3Color && action3X && action3OnPress) {
      rightActions.push(
        this.renderRightAction(action3Icon, action3Color, action3X, progress, () => {
          this.closeSwipeable(); // Fechar o slide de botões
          action3OnPress();
        })
      );
    }

    return (
      <View style={{ width: 192, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
        {rightActions.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </View>
    );
  };

  render() {
    const { children } = this.props;

    return (
      <Swipeable
        ref={(ref) => (this._swipeableRow = ref)}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        renderRightActions={(progress) => this.renderRightActions(progress)}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
