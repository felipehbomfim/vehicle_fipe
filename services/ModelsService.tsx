import SQLite, { SQLiteDatabase } from 'react-native-sqlite-2';

const openDatabase = (): SQLiteDatabase => {
  const db = SQLite.openDatabase({ name: 'mydb.db', createFromLocation: '~mydb.db' });
  return db;
};

const createFipeModelsTable = (): void => {
  const db = openDatabase();

  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS fipe_modelos (id INTEGER PRIMARY KEY AUTOINCREMENT, id_fipe_marcas INTEGER, codigo INTEGER UNIQUE, nome TEXT)',
        [],
        () => {
          console.log('Tabela fipe_modelos criada com sucesso!');
        },
        (error) => {
          console.error('Erro ao criar tabela fipe_modelos:', error);
        }
      );
    });
  } else {
    console.error('Erro ao abrir o banco de dados');
  }
};

const fetchModelsFromDatabase = (marcaCodigo) => {
  createFipeModelsTable();
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fipe_modelos WHERE id_fipe_marcas = ?',
        [marcaCodigo],
        (_, result) => {
          const rows = result.rows;
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const insertModelsToDatabase = async (data, marcaCodigo) => {
  const db = openDatabase();
  db.transaction((tx) => {
    data.forEach((item) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_modelos (codigo, nome, id_fipe_marcas) VALUES (?, ?, ?)',
        [item.codigo, item.nome, marcaCodigo],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Modelo ${item.nome} inserido com sucesso.`);
          }
        },
        (_, error) => {
          console.error(`Erro ao inserir modelo ${item.nome}:`, error);
        }
      );
    });
  });
};

const addModelWithoutCodigoToDataBase = async (nome, idFipeMarca) => {
  const db = openDatabase();
  db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_modelos (nome, id_fipe_marcas) VALUES (?, ?)',
        [nome, idFipeMarca],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Modelo ${item.nome} inserido com sucesso.`);
          }
        },
        (_, error) => {
          console.error(`Erro ao inserir modelo ${item.nome}:`, error);
        }
      );
  });
};

const deleteModelFromDatabase = async (id) => {
  const db = openDatabase();
  db.transaction((tx) => {
    const sql = 'DELETE FROM fipe_modelos WHERE id = ?';
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

const editNomeFromDatabase = async (id, newName) => {
  const db = openDatabase();
  db.transaction((tx) => {
    const sql = 'UPDATE fipe_modelos SET nome = ? WHERE id = ?';
    const params = [newName, id];
    tx.executeSql(
      sql,
      params,
      (_, resultSet) => {
        console.log(`Nome atualizado com sucesso para "${newName}" no registro com ID ${id}!`);
      },
      (_, error) => {
        console.error('Erro ao atualizar o nome:', error);
      }
    );
  });
};

export { fetchModelsFromDatabase, insertModelsToDatabase, addModelWithoutCodigoToDataBase, deleteModelFromDatabase, editNomeFromDatabase };