const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "joIS180301--",
    database: "coffeemdb",
});

// Configuração do body-parser para analisar solicitações de aplicativos/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do body-parser para analisar solicitações de aplicativos/json
app.use(bodyParser.json());



// Função para executar o script SQL
function executeSQLScript(filename, pool, callback) {
    // Leitura do arquivo SQL
    const sql = fs.readFileSync(path.resolve(__dirname, filename), 'utf8');
    
    // Execução do script SQL
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao executar script SQL:', err);
            callback(err); // Chamada de volta com erro
        } else {
            callback(null); // Chamada de volta sem erro
        }
    });
}

// Executar o script SQL durante a inicialização do servidor
executeSQLScript('coffeemdb.sql', db, (err) => {
    if (err) {
        console.error('Erro ao executar script SQL:', err);
    } else {
        console.log('Script SQL executado com sucesso.');
    }
});

// Configuração do CORS
const corsOptions = {
    origin: '*', // Permite acesso de todos os origens
};

// Aplicando o CORS nas rotas
app.use(cors(corsOptions));

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    // Verificar se a solicitação é interna ou externa
    const isInternalRequest = req.headers['internal-request'] === 'true';

    // Se for uma solicitação interna, verificar o token
    if (isInternalRequest) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (token == null) {
            return res.sendStatus(401); // Sem token, não autorizado para solicitações internas
        }

        jwt.verify(token, 'secretpassword', (err, user) => {
            if (err) return res.sendStatus(403); // Token inválido ou expirado
            req.user = user;
            next(); // Continuar para a rota protegida
        });
    } else {
        // Para solicitações externas, continuar para a rota protegida sem autenticação
        next();
    }
};

// Rota para obter dados de um usuário pelo ID
app.get('/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Verificar se id é um número inteiro válido
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // Execute a consulta no banco de dados para obter os dados do usuário pelo ID
    db.query("SELECT id, user, name, surname, description, image_profile FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = result[0];

        res.status(200).json(user);
    });
});




// Rota para login
app.post('/login', async (req, res) => {
    const { user, password } = req.body;

    // Consultar o banco de dados para encontrar o usuário com base no nome de usuário
    db.query("SELECT * FROM users WHERE user = ?", [user], async (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Verificar se o usuário foi encontrado
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Comparar a senha fornecida com a senha armazenada no banco de dados
        const userRecord = results[0];
        const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);

        // Verificar se as senhas correspondem
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT e retornar para o cliente
        const token = jwt.sign({ userId: userRecord.id }, 'secretpassword', { expiresIn: '1h' });
        res.json({ token, id: userRecord.id });
    });
});

app.get('/posts/:id', (req, res) => {
    const { id } = req.params;

    // Verifique se id é um número inteiro válido
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid post ID format.' });
    }

    // Execute a consulta no banco de dados para obter os dados do post pelo ID
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const post = result[0];

        res.status(200).json(post);
    });
});

app.get('/posts', (req, res) => {
    const { _limit } = req.query;

    // A consulta SQL agora sempre ordenará os resultados do mais recente para o mais antigo
    let sqlQuery = "SELECT * FROM posts ORDER BY STR_TO_DATE(date, '%Y-%m-%d') DESC";

    if (_limit) {
        sqlQuery += ` LIMIT ${_limit}`;
    }

    // Execute a consulta no banco de dados
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json(result);
    });
});

app.post('/posts', authenticateToken, (req, res) => {
    const { id_user, date, imageUrl, category, title, resume, content, duration, star, views, status } = req.body;

    // Verifique se id_user é fornecido
    if (!id_user) {
        return res.status(400).json({ error: 'id_user is required.' });
    }

    // Execute a consulta no banco de dados para criar um novo post associado ao id_user
    db.query("INSERT INTO posts (id_user, date, imageUrl, category, title, resume, content, duration, star, views, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [id_user, date, imageUrl, category, title, resume, content, duration, star, views, status], 
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Retorna o id do post criado
            const postId = result.insertId;

            res.status(201).json({ message: 'Post created successfully.', id: postId });
        });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
