const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tenisdatabase',
    password: 'BemVindo!',
    port: 5432,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/clientes', async (req, res) => {
    const {nome, bday, celular, endereco, sexo } = req.body;
    const queryText = 'INSERT INTO clientes(nome, bday, celular, endereco, sexo) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, bday, celular, endereco, sexo];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log('Erro ao cadastrar clientes:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
