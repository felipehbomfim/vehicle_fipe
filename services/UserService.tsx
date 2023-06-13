import SQLite, { SQLiteDatabase } from 'react-native-sqlite-2';

const openDatabase = (): SQLiteDatabase => {
  const db = SQLite.openDatabase({ name: 'mydb.db', createFromLocation: '~mydb.db' });
  return db;
};

const createUserTable = (): void => {
  const db = openDatabase();
  if (db) {
    db.transaction((tx) => {
     console.log(tx);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, sobrenome TEXT, email TEXT UNIQUE, senha TEXT, tipo INTEGER)',
        [],
        () => {
          console.log('Tabela criada com sucesso!');
        },
        (error) => {
          console.error('Erro ao criar tabela:', error);
        }
      );
    });
  } else {
    console.log('Erro ao abrir o banco de dados');
  }
};

const insertUser = (nome, sobrenome, email, senha, tipo, callback) => {
  createUserTable();
  const db = openDatabase();
  db.transaction((tx) => {
    // Verificar se o usuário já existe com base no email
    tx.executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (tx, results) => {
        if (results.rows.length > 0) {
          // Usuário já existe
          callback('Usuário já existe');
        } else {
          // Inserir o novo usuário
          tx.executeSql(
            'INSERT OR IGNORE INTO users (nome, sobrenome, email, senha, tipo) VALUES (?, ?, ?, ?, ?)',
            [nome, sobrenome, email, senha, tipo],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                callback(null); // Chamada de retorno sem erros
              } else {
                callback('Erro ao inserir usuário'); // Chamada de retorno com erro
              }
            },
            (error) => {
              callback(error.message); // Chamada de retorno com erro
            }
          );
        }
      },
      (error) => {
        callback(error.message); // Chamada de retorno com erro
      }
    );
  });
};

const loginQuery = (email, senha, onSuccess, onError) => {
  createUserTable();
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM users WHERE email = ? AND senha = ?',
      [email, senha],
      (tx, results) => {
        if (results.rows.length > 0) {
          const user = results.rows.item(0);
          onSuccess("Sucesso ao realizar login!", user.tipo); // Chamada de função de sucesso passada como argumento
        } else {
          onError("Usuário não encontrado!"); // Chamada de função de erro passada como argumento
        }
      },
      (error) => {
        onError(error.message); // Chamada de retorno com erro
      }
    );
  });
};

export { insertUser, loginQuery };