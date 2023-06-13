import React, { useState, useContext } from 'react';
import { View, Button, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton.tsx';
import { HelperText, TextInput } from 'react-native-paper';
import { loginQuery } from '../services/UserService.tsx';
import CustomDialog from '../components/CustomDialog.tsx';
import { UserTypeContext } from '../provider/UserTypeContext';
import { FAB } from 'react-native-paper';

const LoginPage = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { updateUserType } = useContext(UserTypeContext); // Obtém a função updateUserType do contexto

  const [email, setEmail] = useState('admin');
  const [senha, setSenha] = useState('admin');
  const [errors, setErrors] = useState({
    email: '',
    senha: '',
  });

  //dialog stuffs
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogText, setDialogText] = useState('');

  const openDialog = (type, text) => {
      setDialogType(type);
      setDialogText(text);
      setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const handleLogin = () => {
    if(validadeForm())
      return;

    loginQuery(email, senha,
     (success, tipo) => {
        updateUserType(tipo); // Atualiza o tipo de usuário no contexto
        console.log('Login bem-sucedido');
        navigation.navigate('HomePage');
      },
      (noLogin) => {
          openDialog('error', noLogin);
      },
      (error) => {
          openDialog('error', error);
      }
    );
  };

 //função para atualizar os valores dos inputs e remover os erros quando digitar
 const handleInputChange = (field, value) => {
    // Atualiza o valor do campo correspondente
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'senha':
        setSenha(value);
        break;
      default:
        break;
    }

    // Remove o erro associado a esse campo
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  const handleRegisterPress = () => {
    navigation.navigate('Cadastro');
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  //função para validar o formulario
  const validadeForm = () => {
    let hasError = false;
       const newErrors = {
         email: '',
         senha: '',
       };

       if (email.trim() === '') {
         newErrors.email = 'Digite seu e-mail';
         hasError = true;
       }

       if (senha.trim() === '') {
         newErrors.senha = 'Digite sua senha';
         hasError = true;
       }

       if (hasError) {
         setErrors(newErrors);
         return hasError;
       }

    return hasError;
  }


  const renderLoginForm = () => (
    <View>
      <Image source={require('../assets/images/login-image.jpg')} style={styles.image} />
      <Text style={styles.title}>Faça seu login!</Text>
       <View style={{marginBottom: 10}}>
          <TextInput
               value={email}
               onChangeText={(text) => handleInputChange('email', text)}
               label="E-mail"
               mode="outlined"
               outlineColor="#4444"
               activeOutlineColor="red"
               iconColor="red"
               theme={{ roundness: 10 }}
               left={<TextInput.Icon iconColor="grey" icon="email" />}
               error={!!errors.email}
             />
               {errors.email ? (
                   <HelperText type="error" visible={!!errors.email}>
                     {errors.email}
                   </HelperText>
                 ) : null}
      </View>
      <View style={{marginBottom: 20}}>
          <TextInput
              value={senha}
              onChangeText={(text) => handleInputChange('senha', text)}
              label="Senha"
              mode="outlined"
              secureTextEntry={secureTextEntry}
              outlineColor="#4444"
              activeOutlineColor="red"
              iconColor="red"
              theme={{ roundness: 10 }}
              left={<TextInput.Icon iconColor="grey" icon="lock" />}
              right={<TextInput.Icon iconColor="grey" onPress={toggleSecureTextEntry} icon={secureTextEntry ? 'eye-off': 'eye'} />}
              error={!!errors.senha}
            />
           {errors.senha ? (
               <HelperText type="error" visible={!!errors.senha}>
                 {errors.senha}
               </HelperText>
             ) : null}
      </View>
      <CustomButton title="LOGIN" iconName="sign-in" onPress={handleLogin} />
      <Text style={styles.signupText}>
        Ainda não tem uma conta?{' '}
        <Text style={styles.signupLink} onPress={handleRegisterPress} >Cadastrar-se</Text>
      </Text>
      <CustomDialog text={dialogText} visible={dialogVisible} type={dialogType} onCancel={closeDialog} />
    </View>
  );

  return (
    <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true}>
        {renderLoginForm()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  signupText: {
    marginTop: 30,
    textAlign: 'center',
    marginBottom: 30
  },

  signupLink: {
    fontWeight: 'bold',
    color: 'red',
  },

  image: {
    marginTop: 30,
    marginBottom: 50,
    width: 400,
    height: 300,
  },
});

export default LoginPage;
