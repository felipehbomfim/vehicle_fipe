import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserTypeContext } from '../provider/UserTypeContext';
import { FAB } from 'react-native-paper';
import { fetchVehicleInfoFromDatabase, insertVehicleInfo, updateVehicleInfo, deleteVehicleInfoFromDatabase } from '../services/VehicleInfoService.tsx';
import CustomDialog from '../components/CustomDialog';
import axios from 'axios';
import NoDataMessage from '../components/NoDataMessage';

const VehicleInfo = ({ route }) => {
  //parametros
  const { titulo, marcaCodigo, modeloCodigo, anoCodigo, marcaId, modeloId, anoId } = route.params;
  const { userType } = useContext(UserTypeContext);
  const [loadingSinc, setLoadingSinc] = useState(false);
  const [showForm, setShowForm] = useState(false);

  //Estados
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anoModelo, setAnoModelo] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [valor, setValor] = useState('');
  const [codigoFipe, setCodigoFipe] = useState('');
  const [mesReferencia, setMesReferencia] = useState('');
  const [siglaCombustivel, setSiglaCombustivel] = useState('');

  // Estado da dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogCancelButton, setDialogCancelButton] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogText, setDialogText] = useState('');
  const [dialogButtonText, setDialogButtonText] = useState('');

  //primeira chamada da fetchVehicleInfo
  useEffect(() => {
    fetchVehicleInfo();
  }, []);

  //função para abrir a dialog
  const openDialog = (type, text, buttonText = '', showCancelButton = false) => {
    setDialogType(type);
    setDialogText(text);
    setDialogButtonText(buttonText);
    setDialogVisible(true);
    setDialogCancelButton(showCancelButton);
  };

  //fechar a dialog
  const closeDialog = () => {
    setDialogVisible(false);
  };

  //chamando a funcao no banco de dados para listar as informacoes
  const fetchVehicleInfo = async () => {
    try {
        const data = await fetchVehicleInfoFromDatabase(marcaId, modeloId, anoId);
        if(data != undefined){
            setId(data.id);
            setMarca(data.marca);
            setModelo(data.modelo);
            setAnoModelo(data.ano_modelo);
            setCombustivel(data.combustivel);
            setValor(data.valor);
            setCodigoFipe(data.codigo_fipe);
            setMesReferencia(data.mes_referencia);
            setSiglaCombustivel(data.sigla_combustivel);
        }
    } catch (error) {
        console.error('Erro ao buscar informações do veículo:', error);
    }
  };

  //funcao editar e mandar para o sqlite
  const handleEditPress = async () => {
    if (isEditing) {
      try {
        // Chama a função para atualizar as informações do veículo no banco de dados
        await updateVehicleInfo(
          id,
          marca,
          modelo,
          anoModelo,
          combustivel,
          valor,
          codigoFipe,
          mesReferencia,
          siglaCombustivel
        );
        setIsEditing(false);
      } catch (error) {
        Alert.alert('Oops', 'Erro ao atualizar informações do veículo')
      }
    } else {
      setIsEditing(true);
    }
  };

  //funcao para mostrar um textInput se estiver editando ou somente Text caso nao esteja
  const renderEditableText = (label, value, setValue) => {
    if (isEditing || showForm == true) {
      return (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
        />
      );
    }
    return <Text style={styles.value}>{value}</Text>;
  };

  //faz o sinc das informações do veículo
  const handleSync = async () => {
      try {
        setLoadingSinc(true);
        if(modeloCodigo == null){
           openDialog("info", "Não é possível fazer a sincronização com a API, pois esse ano foi cadastrado via formulário.")
           setLoadingSinc(false);
           return;
        }

        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`
        );
        const data = response.data;
        await insertVehicleInfo(data, marcaId, modeloId, anoId);
        fetchVehicleInfo();
        openDialog('success', 'Sincronização concluída.');
        setLoadingSinc(false);
      } catch (error) {
        openDialog('error', 'Erro durante a sincronização: ' + error);
        setLoadingSinc(false);
      }
  };

   //lidando com pressionamento do botão de adição
   const handleAddButton = () => {
       setShowForm(true);
   };

   const handleSavePress = async (nome) => {
      if (marca !== '' && modelo !== '' && anoModelo !== '' && combustivel !== '' && valor !== '' && codigoFipe !== '' && mesReferencia !== '' && siglaCombustivel !== '') {
         const data = {
            Marca: marca,
            Modelo: modelo,
            AnoModelo: anoModelo,
            Combustivel: combustivel,
            Valor: valor,
            CodigoFipe: codigoFipe,
            MesReferencia: mesReferencia,
            SiglaCombustivel: siglaCombustivel
          };
          await insertVehicleInfo(data, marcaId, modeloId, anoId);
          fetchVehicleInfo();
          setShowForm(false);
          openDialog('success', 'Os dados foram adicionados com sucesso!');
        } else {
           openDialog('error', 'Por favor, preencha todos os campos');
        }
   };

  const handleRemoveButton = () => {
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

  const deleteRecordFromDatabase = async (id) => {
    try {
      await deleteVehicleInfoFromDatabase(id);
      setId('');
      openDialog("success", "Registro removido com sucesso!");
    } catch (error) {
      openDialog("error", 'Erro ao excluir o registro:' + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView  automaticallyAdjustKeyboardInsets={true}>
       <View style={{padding:16}}>
        { (id || showForm == true) ? (
          <>
              <Text style={styles.title}>Informações do Veículo</Text>
              <View style={styles.itemContainer}>
                <Icon name="car" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Marca:</Text>
                {renderEditableText('Marca', marca, setMarca)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="cogs" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Modelo:</Text>
                {renderEditableText('Modelo', modelo, setModelo)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="calendar" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Ano do Modelo:</Text>
                {renderEditableText('Ano do Modelo', anoModelo, setAnoModelo)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="tint" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Combustível:</Text>
                {renderEditableText('Combustível', combustivel, setCombustivel)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="money" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Valor:</Text>
                {renderEditableText('Valor', valor, setValor)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="barcode" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Código Fipe:</Text>
                {renderEditableText('Código Fipe', codigoFipe, setCodigoFipe)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="calendar" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Mês de Referência:</Text>
                {renderEditableText('Mês de Referência', mesReferencia, setMesReferencia)}
              </View>
              <View style={styles.itemContainer}>
                <Icon name="flask" size={24} color="#333" style={styles.icon} />
                <Text style={styles.label}>Sigla do Combustível:</Text>
                {renderEditableText('Sigla do Combustível', siglaCombustivel, setSiglaCombustivel)}
              </View>
              <TouchableOpacity style={styles.button} onPress={(showForm == true) ? handleSavePress : handleEditPress}>
                <Text style={styles.buttonText}>{(isEditing || showForm == true) ? 'Salvar' : 'Editar'}</Text>
                <Icon name={(isEditing || showForm == true) ? 'check' : 'pencil'} size={20} color="white" style={styles.icon} />
              </TouchableOpacity>
          </>
        ) : (
          <NoDataMessage />
        )}
        </View>
        </ScrollView>
         <View style={styles.fabContainer}>
                {userType === 1 && (
                  <>
                    {id && (
                      <FAB
                        key="removeButton"
                        style={[styles.fab, styles.removeButton]}
                        icon="delete"
                        color="white"
                        onPress={handleRemoveButton}
                      />
                    )}
                    {!id && (
                      <FAB
                        key="addButton"
                        style={[styles.fab, styles.addButton]}
                        icon="plus"
                        color="white"
                        onPress={handleAddButton}
                      />
                    )}
                    <FAB
                      key="refreshButton"
                      style={[styles.fab, styles.refreshButton]}
                      icon={!loadingSinc ? 'refresh' : ''}
                      loading={loadingSinc}
                      color="white"
                      onPress={handleSync}
                      disabled={loadingSinc}
                    />
                  </>
                )}
              </View>

              <CustomDialog
                showCancelButton={dialogCancelButton}
                ButtonTitle={dialogButtonText}
                text={dialogText}
                visible={dialogVisible}
                type={dialogType}
                onCancel={closeDialog}
              />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 59,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
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

  refreshButton: {
    backgroundColor: '#059af0',
    borderRadius: 100,
  },

  addButton: {
    backgroundColor: '#08cc56',
    borderRadius: 100,
  },

  removeButton: {
    backgroundColor: 'red',
    borderRadius: 100,
  },
});

export default VehicleInfo;
