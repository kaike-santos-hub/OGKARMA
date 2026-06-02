import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/ogkarmaRoutes.js'

dotenv.config();

const app = express();

const PORTA = process.env.PORTA;

app.use(cors());

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('public/1ogkarmacontato.html');
});

app.use('/chat', chatRoutes);

app.listen(PORTA, () => {
    console.log("Servidor rodando http://localhost:" + PORTA);
});


/*
|--------------------------------------------------------------------------
| CONEXÃO COM MYSQL
|--------------------------------------------------------------------------
*/

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ogkarma"
});

conexao.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar no banco:", erro);
        return;
    }

    console.log("Conectado ao MySQL!");
});

/*
|--------------------------------------------------------------------------
| ROTA TESTE
|--------------------------------------------------------------------------
*/

// app.get("/", (req, res) => {
//     res.send("API funcionando");
// });

// const router = express.Router();

/*
|--------------------------------------------------------------------------
| LISTAR PRODUTOS
|--------------------------------------------------------------------------
*/

app.get("/produtos", (req, res) => {

    const sql = "SELECT * FROM tbl_produto";

    conexao.query(sql, (erro, resultado) => {

        if (erro) {
            console.log(erro);
            return res.status(500).json({
                erro: "Erro ao buscar produtos"
            });
        }

        res.json(resultado);
    });
});


/*
|--------------------------------------------------------------------------
| CADASTRAR PRODUTO
|--------------------------------------------------------------------------
*/

app.post("/produtos", (req, res) => {

    const {
        tipo_produto,
        modelo_produto,
        nome_produto,
        marca_produto,
        tamanho_produto,
        cor_produto,
        preco_produto,
        img_produto
    } = req.body;

    const sql = `
        INSERT INTO tbl_produto
        (
            tipo_produto,
            modelo_produto,
            nome_produto,
            marca_produto,
            tamanho_produto,
            cor_produto,
            preco_produto,
            img_produto
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [
            tipo_produto,
            modelo_produto,
            nome_produto,
            marca_produto,
            tamanho_produto,
            cor_produto,
            preco_produto,
            img_produto
        ],
        (erro, resultado) => {

            if (erro) {
                console.log(erro);

                return res.status(500).json({
                    erro: "Erro ao cadastrar produto"
                });
            }

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso",
                id: resultado.insertId
            });
        }
    );
});

/*
|--------------------------------------------------------------------------
| SERVIDOR
|--------------------------------------------------------------------------
*/

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});