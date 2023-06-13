import SQLite, { SQLiteDatabase } from 'react-native-sqlite-2';

const openDatabase = (): SQLiteDatabase => {
  const db = SQLite.openDatabase({ name: 'mydb.db', createFromLocation: '~mydb.db' });
  return db;
};

const createFipeYearsTable = (): void => {
  const db = openDatabase();

  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS fipe_anos (id INTEGER PRIMARY KEY AUTOINCREMENT, id_fipe_marcas INTEGER, id_fipe_modelos INTEGER, codigo INTEGER, nome TEXT UNIQUE)',
        [],
        () => {
          console.log('Tabela fipe_anos criada com sucesso!');
        },
        (error) => {
          console.error('Erro ao criar tabela fipe_anos:', error);
        }
      );
    });
  } else {
    console.error('Erro ao abrir o banco de dados');
  }
};

const fetchYearsFromDatabase = (marcaCodigo, modeloCodigo) => {
  createFipeYearsTable();
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fipe_anos WHERE id_fipe_marcas = ? AND id_fipe_modelos = ?',
        [marcaCodigo, modeloCodigo],
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

const insertYearsToDatabase = async (data, marcaCodigo, modeloCodigo) => {
  const db = openDatabase();

  db.transaction((tx) => {
    data.forEach((item) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_anos (codigo, nome, id_fipe_marcas, id_fipe_modelos) VALUES (?, ?, ?, ?)',
        [item.codigo, item.nome, marcaCodigo, modeloCodigo],
        (_, resultSet) => {
          console.log(resultSet);
          if (resultSet.rowsAffected > 0) {
            console.log(`Ano ${item.nome} inserido com sucesso.`);
          }
        },
        (_, error) => {
          console.log(`Erro ao inserir ano ${item.nome}:`, error);
        }
      );
    });
  });
};

const addYearWithoutCodigoToDataBase = async (nome, idFipeMarca, idFipeModelo) => {
  const db = openDatabase();
  db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_anos (nome, id_fipe_marcas, id_fipe_modelos) VALUES (?, ?, ?)',
        [nome, idFipeMarca, idFipeModelo],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Ano ${item.nome} inserido com sucesso.`);
          }
        },
        (_, error) => {
          console.error(`Erro ao inserir ano ${item.nome}:`, error);
        }
      );
  });
};

const deleteModelFromDatabase = async (id) => {
  const db = openDatabase();
  db.transaction((tx) => {
    const sql = 'DELETE FROM fipe_anos WHERE id = ?';
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
    const sql = 'UPDATE fipe_anos SET nome = ? WHERE id = ?';
    const params = [newName, id];
    tx.executeSql(
      sql,
      params,
      (_, resultSet) => {
        console.log(`Ano atualizado com sucesso para "${newName}" no registro com ID ${id}!`);
      },
      (_, error) => {
        console.error('Erro ao atualizar o nome:', error);
      }
    );
  });
};

export { fetchYearsFromDatabase, insertYearsToDatabase, addYearWithoutCodigoToDataBase, deleteModelFromDatabase, editNomeFromDatabase };