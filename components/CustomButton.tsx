import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const CustomButton = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, { width: width - 20 }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
      <Icon name={iconName} size={20} color="white" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    borderRadius: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomButton;
