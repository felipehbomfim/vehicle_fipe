import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import CustomButton from '../components/CustomButton.tsx';
import { insertUser } from '../services/UserService.tsx';

const IntroScreen = ({ navigation }) => {

  const handleStart = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    insertUser("admin", "admin", "admin", "admin", "1", (error) => {
      if (error) {

         console.log(error)
      } else {
         console.log("Usuário admin adicionado com sucesso!")
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/intro-screen-image.jpg')} style={styles.image} />
      <Text style={styles.description}>
        Esse é um aplicativo que permite a listagem de marcas, modelos, anos e descrições de veículos.
      </Text>
     <Text style={[styles.description, { marginBottom: 50 }]}>
       Foi utilizada a API gratuita{' '}
       <TouchableOpacity onPress={() => Linking.openURL('https://parallelum.com.br')}>
         <Text style={{ textDecorationLine: 'underline' }}>
           https://parallelum.com.br
         </Text>
       </TouchableOpacity>{' '}
       para obter os dados necessários.
     </Text>
      <CustomButton title="Começar" iconName="chevron-right" onPress={handleStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff'
  },

  image: {
    marginTop: 70,
    marginBottom: 50,
    width: 400,
    height: 300,
  },

  description: {
     marginBottom: 20,
     textAlign: 'center',
     fontSize: 16,
     color: '#333',
     fontFamily: 'Arial',
     lineHeight: 24,
  },
});

export default IntroScreen;
