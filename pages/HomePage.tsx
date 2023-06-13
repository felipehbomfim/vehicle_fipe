import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import { ListItem, Divider, SearchBar } from '@rneui/themed';
import { FlatList, RectButton, Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import SwipeableButtons from '../components/SwipeableButtons';
import NoDataMessage from '../components/NoDataMessage';
import CustomDialog from '../components/CustomDialog';

import { UserTypeContext } from '../provider/UserTypeContext';
import { fetchMarcasFromDatabase, insertMarcasToDatabase, deleteMarcaFromDatabase, editNomeFromDatabase, addMarcaWithoutCodigoToDataBase } from '../services/BrandsService.tsx';
import { useCollapsibleSubHeader, CollapsibleSubHeaderAnimator } from 'react-navigation-collapsible';
import { Searchbar } from 'react-native-paper';


const HomePage = () => {
   // Navegação
   const navigation = useNavigation();

  // Subheader expansível
   const {
     onScroll /* Manipulador de eventos */,
     containerPaddingTop /* número */,
     scrollIndicatorInsetTop /* número */,
     translateY,
   } = useCollapsibleSubHeader();

   //Estados
   const [loading, setLoading] = useState(true);
   const [loadingSinc, setLoadingSinc] = useState(false);
   const [marcas, setMarcas] = useState([]);
   const { userType } = useContext(UserTypeContext);

   // Estado da dialog
   const [dialogVisible, setDialogVisible] = useState(false);
   const [dialogCancelButton, setDialogCancelButton] = useState(false);
   const [dialogType, setDialogType] = useState('');
   const [dialogText, setDialogText] = useState('');
   const [dialogButtonText, setDialogButtonText] = useState('');

   // Estado de busca
   const [searchQuery, setSearchQuery] = useState('');

   //função para abrir a dialog
   const openDialog = (type, text, buttonText = '', showCancelButton = false) => {
      setDialogType(type);
      setDialogText(text);
      setDialogButtonText(buttonText);
      setDialogVisible(true);
      setDialogCancelButton(showCancelButton);
   };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const onAccept = () => {
     alert('oi')
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // Buscar marcas do banco de dados
  const fetchMarcas = async () => {
    try {
      const data = await fetchMarcasFromDatabase();
      setMarcas(data);
      setLoading(false);
    } catch (error) {
      console.log('Erro ao buscar marcas do banco de dados:', error);
      setLoading(false);
    }
  };

  //lidando com pressionamento do botão de remoção
  const handleRemoveButton = (id) => {
    Alert.alert('Deseja remover o registro?', 'Esta ação será irreversível e o registro será excluído permanentemente do banco de dados.', [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Remover',
          onPress: () => {
            // Chamar a função de exclusão do banco de dados aqui
            deleteRecordFromDatabase(id);
          },
          style: 'destructive',
        },
    ]);
  };

  //abrindo o alert para editar
  const openEditDialog = (id, nome) => {
      Alert.prompt(
        'Editar marca',
        'Digite o novo nome:',
        (newName) => {
          if (newName !== '') {
            editRegisterFromDataBase(id, newName);
          }
        },
        'plain-text',
        nome,
      );
  };

  //funcao com o try catch para exibir o alerta e atualizar a listagem
  const editRegisterFromDataBase = async (id, newName) => {
    try {
     await editNomeFromDatabase(id, newName);
     fetchMarcas(); // Atualiza a lista de marcas após a exclusão
     openDialog("success", "Registro atualizado com sucesso!");
    } catch (error) {
      openDialog("error", 'Erro ao atualizar o registro:' + error);
    }
  };

  const deleteRecordFromDatabase = async (id) => {
    try {
     await deleteMarcaFromDatabase(id);
     fetchMarcas(); // Atualiza a lista de marcas após a exclusão
     openDialog("success", "Registro removido com sucesso!");
    } catch (error) {
      openDialog("error", 'Erro ao excluir o registro:' + error);
    }
  };

  // Renderizar cada item no FlatList
  const renderItem = ({ item }) => {
    return (
    <SwipeableButtons
      key={item.id.toString()}
      action1Icon="edit"
      action1Color="#059af0"
      action1X={192}
      action1OnPress={() => {
        openEditDialog(item.id, item.nome)
      }}
      action2Icon={userType === 1 ? "trash" : ""}
      action2Color="red"
      action2X={128}
      action2OnPress={() => {
        if (userType === 1) {
          handleRemoveButton(item.id);
        }
      }}
    >
      <RectButton style={styles.rectButton} onPress={() => navigation.navigate('ModelosPage', { titulo: item.nome, marcaCodigo: item.codigo, marcaId: item.id })}>
        <Text>{item.nome}</Text>
      </RectButton>
    </SwipeableButtons>
    );
  };


  //lidando com pressionamento do botão de adição
  const handleAddButton = () => {
      Alert.prompt(
        'Digite o nome da marca que deseja inserir',
        'Digite o novo nome:',
        (nome) => {
          if (nome !== '') {
            addRecordToDataBase(nome);
          }
        },
        'plain-text'
      );
  };

  //lidando com o retorno e atualizacao da listagem
  const addRecordToDataBase = async (nome) => {
    try {
      await addMarcaWithoutCodigoToDataBase(nome);
      fetchMarcas(); // Atualiza a lista de marcas após a exclusão
      openDialog("success", "Registro adicionado com sucesso!");
    } catch (error) {
      openDialog("error", 'Erro ao adicionar o registro:' + error);
    }
  };

  //lidando com pressionamento do botão de sincronização
  const handleSync = async () => {
    try {
      setLoadingSinc(true);
      // Consultar a API para obter os dados
      const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');

      // Obter dados da resposta
      const data = response.data;
      await insertMarcasToDatabase(data);
      fetchMarcas();
      setLoadingSinc(false);
      openDialog('success', 'Sincronização concluída.');
    } catch (error) {
      openDialog('error', 'Erro durante a sincronização:' + error);
      setLoadingSinc(false);
    }
  };

  //busca o quer for digitado
  const filterMarcas = (marcas, searchQuery) => {
     return marcas.filter((marca) => marca.nome.toLowerCase().includes(searchQuery.toLowerCase()));
  };

   return (
     <SafeAreaView style={styles.container}>
       {loading ? (
         <ActivityIndicator size="large" color="#0000ff" />
       ) : (
         <>
           <Animated.FlatList
             data={filterMarcas(marcas, searchQuery)}
             ItemSeparatorComponent={() => <View style={styles.separator} />}
             renderItem={renderItem}
             keyExtractor={(item) => item.id.toString()}
             style={styles.list}
             ListEmptyComponent={() => (
               <NoDataMessage />
             )}
             onScroll={onScroll}
             contentContainerStyle={{ paddingTop: containerPaddingTop }}
             scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
           />
           <CollapsibleSubHeaderAnimator translateY={translateY}>
              <View
                style={{
                  paddingRight: 10,
                  paddingLeft: 10,
                  paddingBottom: 10,
                  width: '100%',
                  height: 65,
                  backgroundColor: '#DD2C00',
                }}
              >
              <Searchbar
                placeholder="Busque por uma marca..."
                onChangeText={value => setSearchQuery(value)}
                value={searchQuery}
                activeOutlineColor="red"
                style={{borderRadius: 10, backgroundColor:'white'}}
                iconColor="red"
              />
              </View>
           </CollapsibleSubHeaderAnimator>
           {userType === 1 && (
             <View style={styles.fabContainer}>
               <FAB
                 key="addButton"
                 style={[styles.fab, styles.addButton]}
                 icon="plus"
                 color="white"
                 onPress={handleAddButton}
               />
               <FAB
                 key="refreshButton"
                 style={[styles.fab, styles.refreshButton]}
                 icon={!loadingSinc ? 'refresh' : ''}
                 loading={loadingSinc}
                 color="white"
                 onPress={handleSync}
                 disabled={loadingSinc}
               />
             </View>
           )}
         </>
       )}
       <CustomDialog
         showCancelButton={dialogCancelButton}
         ButtonTitle={dialogButtonText}
         text={dialogText}
         visible={dialogVisible}
         type={dialogType}
         onCancel={closeDialog}
         onAccept={onAccept}
       />
     </SafeAreaView>
   );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    margin: 16,
    flexDirection: 'row',
  },

  fab: {
    marginHorizontal: 8,
  },

  addButton: {
    backgroundColor: '#08cc56',
    borderRadius: 100,
  },

  refreshButton: {
    backgroundColor: '#059af0',
    borderRadius: 100,
  },

  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },

  rectButton: {
    verticalAlign: "center",
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
});

export default HomePage;