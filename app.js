const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Configurar a conexão com o banco de dados MySQL

//const é um tipo de variável que se mantem inalteravel
//db é o nome escolhido para essa varivavel
//host é o local onde esse banco de dados está
//user é o usuário do banco de ados
//database é qual base de dados (obs: n/ confundir com tabela) a ser utilizada;

const db = mysql.createConnection({
host: 'localhost',
user: 'phpmyadmin',
password: 'aluno',
database: 'mydb',
});


//proxima parte trata apenas de um codigo que verifica se deu certo ou n a conexão com o banco de dados
db.connect((err) => {
if (err) {
console.error('Erro ao conectar ao banco de dados:', err);
throw err;
}
console.log('Conexão com o banco de dados MySQL estabelecida.');
});

// Configurar a sessão
//usando a variavel app e possivel quando recarregar a página manter as informações do arquivo ejs padronizadas
app.use(
session({
secret: 'sua_chave_secreta',
resave: true,
saveUninitialized: true,
})
);


//
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');

// Rota para a página de login
app.get('/', (req, res) => {
res.render('login');
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
const { username, password } = req.body;

const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

db.query(query, [username, password], (err, results) => {
if (err) throw err;

if (results.length > 0) {
req.session.loggedin = true;
req.session.username = username;
res.redirect('/dashboard');
} else {
res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
}
});
});

// Rota para a página do painel
app.get('/dashboard', (req, res) => {



//
//
//
//modificação aqui
if (req.session.loggedin) {
//res.send(`Bem-vindo, ${req.session.username}!<br><a href="/logout">Sair</a>`);
res.sendFile(__dirname + '/index.html');
} else {
res.send('Faça login para acessar esta página. <a href="/">Login</a>');
}
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
req.session.destroy(() => {
res.redirect('/');
});
});

app.listen(3000, () => {
console.log('Servidor rodando na porta 3000');
});
