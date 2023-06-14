import SQLite, { SQLiteDatabase } from 'react-native-sqlite-2';

const openDatabase = (): SQLiteDatabase => {
  const db = SQLite.openDatabase({ name: 'mydb.db', createFromLocation: '~mydb.db' });
  return db;
};

const createFipeMarcasTable = (): void => {
  const db = openDatabase();

  if (db) {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS fipe_marcas (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo INTEGER UNIQUE, nome TEXT)',
        [],
        () => {
          console.log('Tabela fipe_marcas criada com sucesso!');
        },
        (error) => {
          console.error('Erro ao criar tabela fipe_marcas:', error);
        }
      );
    });
  } else {
    console.error('Erro ao abrir o banco de dados');
  }
};

const fetchMarcasFromDatabase = () => {
  createFipeMarcasTable();
  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fipe_marcas ORDER BY nome ASC',
        [],
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

const addMarcaWithoutCodigoToDataBase = async (nome) => {
  const db = openDatabase();

  db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_marcas (nome) VALUES (?)',
        [nome],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Marca ${item.nome} inserida com sucesso.`);
          }
        },
        (_, error) => {
          console.error(`Erro ao inserir marca ${item.nome}:`, error);
        }
      );
  });
};

const insertMarcasToDatabase = async (data) => {
  const db = openDatabase();
  db.transaction((tx) => {
    data.forEach((item) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO fipe_marcas (codigo, nome) VALUES (?, ?)',
        [item.codigo, item.nome],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Marca ${item.nome} inserida com sucesso.`);
          }
        },
        (_, error) => {
          console.error(`Erro ao inserir marca ${item.nome}:`, error);
        }
      );
    });
  });
};

const deleteMarcaFromDatabase = async (id) => {
  const db = openDatabase();
  db.transaction((tx) => {
    const sql = 'DELETE FROM fipe_marcas WHERE id = ?';
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
    const sql = 'UPDATE fipe_marcas SET nome = ? WHERE id = ?';
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


export { fetchMarcasFromDatabase, insertMarcasToDatabase, deleteMarcaFromDatabase, editNomeFromDatabase, addMarcaWithoutCodigoToDataBase };