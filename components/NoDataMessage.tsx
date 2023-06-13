import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const NoDataMessage = () => {
  return (
    <View style={styles.centerContainer}>
      <LottieView
        source={require('../assets/lotties/no_data.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.noDataText}>Sem registros encontrados</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 300,
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    marginTop: 60,
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
  },
});

export default NoDataMessage;
