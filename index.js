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
    const {nome, bday, celular, endereco, genero } = req.body;
    const queryText = 'INSERT INTO clientes(nome, bday, celular, endereco, genero) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, bday, celular, endereco, genero];

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

app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const queryText = 'DELETE FROM clientes WHERE id = $1 RETURNING *';

    try {
        const result = await pool.query(queryText, [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Cliente não encontrado');
        } else {
            res.status(200).send('Cliente deletado com sucesso');
        }
    } catch (err) {
        console.log('Erro ao deletar cliente:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Cliente não encontrado');
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.log('Erro ao buscar cliente:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, bday, celular, endereco, genero } = req.body;
    const queryText = `
        UPDATE clientes
        SET nome = $1, bday = $2, celular = $3, endereco = $4, genero = $5
        WHERE id = $6 RETURNING *`;

    try {
        const result = await pool.query(queryText, [nome, bday, celular, endereco, genero, id]);
        if (result.rowCount === 0) {
            res.status(404).send('Cliente não encontrado');
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.log('Erro ao atualizar cliente:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});
