import SQLite, { SQLiteDatabase } from 'react-native-sqlite-2';

const openDatabase = (): SQLiteDatabase => {
  const db = SQLite.openDatabase({ name: 'mydb.db', createFromLocation: '~mydb.db' });
  return db;
};

const createVehicleInfoTable = (): void => {
  const db = openDatabase();

  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS vehicle_info (id INTEGER PRIMARY KEY AUTOINCREMENT, id_fipe_marcas INTEGER, id_fipe_modelos INTEGER, id_fipe_anos INTEGER, marca TEXT, modelo TEXT, ano_modelo TEXT, combustivel TEXT, valor TEXT, codigo_fipe TEXT, mes_referencia TEXT, sigla_combustivel TEXT)',
        [],
        () => {
          console.log('Tabela vehicle_info criada com sucesso!');
        },
        (error) => {
           console.error(error);
        }
      );
    });
  } else {
    console.log('Erro ao abrir o banco de dados');
  }
};

const fetchVehicleInfoFromDatabase = (marcaCodigo, modeloCodigo, anoCodigo) => {
  createVehicleInfoTable();
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM vehicle_info WHERE id_fipe_marcas = ? AND id_fipe_modelos = ? AND id_fipe_anos = ?',
        [marcaCodigo, modeloCodigo, anoCodigo],
        (_, result) => {
          const row = result.rows.item(0);
          resolve(row);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const checkIfDataExists = async (marcaCodigo, modeloCodigo, anoCodigo) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM vehicle_info WHERE id_fipe_marcas = ? AND id_fipe_modelos = ? AND id_fipe_anos = ?',
        [marcaCodigo, modeloCodigo, anoCodigo],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(true); // Dados já cadastrados
          } else {
            resolve(false); // Dados não encontrados
          }
        },
        (_, error) => {
          reject(error); // Erro ao executar a consulta
        }
      );
    });
  });
};

const insertVehicleInfo = async (data, marcaCodigo, modeloCodigo, anoCodigo) => {
  try {
    const dataExists = await checkIfDataExists(marcaCodigo, modeloCodigo, anoCodigo);
    if (dataExists) {
      console.log('Os dados já estão cadastrados.');
    } else {
      const db = openDatabase();
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO vehicle_info (id_fipe_marcas, id_fipe_modelos, id_fipe_anos, marca, modelo, ano_modelo, combustivel, valor, codigo_fipe, mes_referencia, sigla_combustivel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [marcaCodigo, modeloCodigo, anoCodigo, data.Marca, data.Modelo, data.AnoModelo, data.Combustivel, data.Valor, data.CodigoFipe, data.MesReferencia, data.SiglaCombustivel],
          (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              console.log(`Modelo ${data.Modelo} inserido com sucesso.`);
            }
          },
          (_, error) => {
            console.log(`Erro ao inserir modelo ${data.Modelo}:`, error);
          }
        );
      });
    }
  } catch (error) {
    console.log('Erro ao verificar se os dados já estão cadastrados:', error);
  }
};

const updateVehicleInfo = (id, marca, modelo, anoModelo, combustivel, valor, codigoFipe, mesReferencia, siglaCombustivel) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE vehicle_info SET marca = ?, modelo = ?, ano_modelo = ?, combustivel = ?, valor = ?, codigo_fipe = ?, mes_referencia = ?, sigla_combustivel = ? WHERE id = ?`,
        [marca, modelo, anoModelo, combustivel, valor, codigoFipe, mesReferencia, siglaCombustivel, id],
           (trans, results) => {
             resolve(results);
           },
           (error) => {
              reject(error);
           });
         });
  });
};

const deleteVehicleInfoFromDatabase = async (id) => {
  const db = openDatabase();
  db.transaction((tx) => {
    const sql = 'DELETE FROM vehicle_info WHERE id = ?';
    const params = [id];
    tx.executeSql(
      sql,
      params,
      (_, resultSet) => {
        console.log(`Registro com ID ${id} excluído com sucesso!`);
      },
      (_, error) => {
        console.error('Erro ao excluir o registro:', error);
      }
    );
  });
};

export { fetchVehicleInfoFromDatabase, insertVehicleInfo, updateVehicleInfo, deleteVehicleInfoFromDatabase };