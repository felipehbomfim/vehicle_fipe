import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Image, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import CustomButton from '../components/CustomButton.tsx';
import { HelperText, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { insertUser } from '../services/UserService.tsx';
import CustomDialog from '../components/CustomDialog.tsx';
import { useNavigation } from '@react-navigation/native';

const UserRegister = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({
    nome: '',
    sobrenome: '',
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
      if(dialogType == "success")
        navigation.navigate('Login');
  };

 //lidando com o cadastro do usuario
  const handleCadastro = () => {
    if(validadeForm())
        return;

      if (Object.values(errors).every((error) => error === '')) {
         insertUser(nome, sobrenome, email, senha, "2", (error) => {
              if (error) {
                 openDialog('error', 'Erro ao inserir usuário: ' + error);
              } else {
                 openDialog('success', "Sucesso ao realizar cadastro");
              }
         });
      }
  };

  //função para validar o formulario
  const validadeForm = () => {
    let hasError = false;
       const newErrors = {
         nome: '',
         sobrenome: '',
         email: '',
         senha: '',
       };

       if (nome.trim() === '') {
         newErrors.nome = 'Digite seu nome';
         hasError = true;
       }

       if (sobrenome.trim() === '') {
         newErrors.sobrenome = 'Digite seu sobrenome';
         hasError = true;
       }

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

 //função para atualizar os valores dos inputs e remover os erros quando digitar
 const handleInputChange = (field, value) => {
    // Atualiza o valor do campo correspondente
    switch (field) {
      case 'nome':
        setNome(value);
        break;
      case 'sobrenome':
        setSobrenome(value);
        break;
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

  const renderLoginForm = () => (
    <View>
        <Image source={require('../assets/images/signup-image.png')} style={styles.image} />
        <Text style={styles.title}>Faça seu cadastro!</Text>
              <View style={styles.nameContainer}>
                    <View style={{flex:1, marginRight:10, marginBottom: 10}}>
                       <TextInput
                          value={nome}
                          onChangeText={(text) => handleInputChange('nome', text)}
                          label="Nome"
                          mode="outlined"
                          outlineColor="#4444"
                          activeOutlineColor="red"
                          iconColor="red"
                          theme={{ roundness: 10 }}
                          error={!!errors.nome}
                          helperText="tete"
                          left={<TextInput.Icon iconColor="grey" icon="account" />}
                        />
                          {errors.nome ? (
                              <HelperText style={{marginBottom:0}} type="error" visible={!!errors.nome}>
                                {errors.nome}
                              </HelperText>
                            ) : null}
                      </View>
                    <View style={{flex:1, marginBottom: 10}}>
                         <TextInput
                             value={sobrenome}
                             onChangeText={(text) => handleInputChange('sobrenome', text)}
                             label="Sobrenome"
                             mode="outlined"
                             outlineColor="#4444"
                             activeOutlineColor="red"
                             iconColor="red"
                             theme={{ roundness: 10 }}
                             left={<TextInput.Icon iconColor="grey" icon="account" />}
                             error={!!errors.sobrenome}
                           />
                           {errors.sobrenome ? (
                             <HelperText type="error" visible={!!errors.sobrenome}>
                               {errors.sobrenome}
                             </HelperText>
                           ) : null}
                    </View>
                </View>
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
                        error={!!errors.senha}
                      />
                     {errors.senha ? (
                         <HelperText type="error" visible={!!errors.senha}>
                           {errors.senha}
                         </HelperText>
                       ) : null}
                </View>
        <CustomButton title="CRIAR" iconName="check-circle" onPress={handleCadastro} />
        <CustomDialog text={dialogText} visible={dialogVisible} type={dialogType} onCancel={closeDialog} />
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView} automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.container}>
            {renderLoginForm()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 nameContainer: {
    flexDirection: 'row',
  },

  scrollView: {
    backgroundColor: '#fff',
  },

  container: {
     flex: 1,
     paddingLeft: 20,
     paddingRight: 20,
     alignItems: 'center',
     backgroundColor: '#fff',
   },

  title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 20,
     textAlign: 'center',
  },

  image: {
    marginBottom: 50,
    width: 400,
    height: 400,
  },
});

export default UserRegister;
