import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './pages/LoginPage';
import UserRegister from './pages/UserRegister';
import IntroScreen from './pages/IntroScreen';
import HomePage from './pages/HomePage';
import ModelosPage from './pages/ModelosPage';
import YearsPage from './pages/YearsPage';
import VehicleInfo from './pages/VehicleInfo';
import { UserTypeProvider } from './provider/UserTypeContext';

//criando a stack
const Stack = createStackNavigator();

const App = () => {
  const handleStart = () => {
    navigationRef.current?.navigate('Login');
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

      React.useLayoutEffect(() => {
        navigationRef.setOptions({
          headerSearchBarOptions: {
            // search bar options
          },
        });
      }, [navigationRef]);
  };



  //definindo o navigation container e as rotas das paginas
  return (
    <UserTypeProvider>
         <NavigationContainer>
             <Stack.Navigator screenOptions={{
                                      headerStyle: {
                                        backgroundColor: '#DD2C00',
                                      },
                                      headerTintColor: '#fff',
                                      headerTitleStyle: {
                                        fontWeight: 'bold',
                                      },
                                    }} initialRouteName="Seja bem vindo">
                  <Stack.Screen
                         name="IntroScreen"
                         component={IntroScreen}
                         options={{
                           title: 'Seja bem vindo',
                         }}
                       />
                   <Stack.Screen
                           name="Login"
                           component={LoginPage}
                           options={{
                             gestureEnabled: false,
                             headerLeft: false,
                             backgroundColor: 'red'
                           }}

                         />
                  <Stack.Screen
                          name="HomePage"
                          component={HomePage}
                          options={{
                            gestureEnabled: false,
                            headerLeft: false,
                            backgroundColor: 'red',
                            title: 'Listagem de todas as marcas'
                          }}
                        />
                  <Stack.Screen
                            name="ModelosPage"
                            component={ModelosPage}
                            options={({ route }) => ({
                                backgroundColor: 'red',
                                title: route.params.titulo,
                                headerBackTitle: 'Marcas',
                            })}
                          />
                  <Stack.Screen
                              name="AnosPage"
                              component={YearsPage}
                              options={({ route }) => ({
                                  backgroundColor: 'red',
                                  title: route.params.titulo,
                                  headerBackTitle: 'Modelos',
                              })}
                            />
                 <Stack.Screen
                      name="VehicleInfo"
                      component={VehicleInfo}
                      options={({ route }) => ({
                          backgroundColor: 'red',
                          title: route.params.titulo,
                          headerBackTitle: 'Anos',
                      })}
                    />
               <Stack.Screen name="Cadastro" component={UserRegister} />
             </Stack.Navigator>
           </NavigationContainer>
       </UserTypeProvider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;