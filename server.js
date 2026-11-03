import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/ogkarmaRoutes.js';

// 1. Carregar variáveis do ficheiro .env
dotenv.config();

const app = express();

// Porta do servidor (se não estiver no .env, usa 3000)
const PORTA = process.env.PORTA || process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota inicial - Alterado para abrir diretamente na página de roupas
app.get('/', (req, res) => {
    res.sendFile('1ogkarmaroupa.html', { root: './public' });
});

// Rotas de chat
app.use('/chat', chatRoutes);

/*
|--------------------------------------------------------------------------
| CONEXÃO COM O SUPABASE
|--------------------------------------------------------------------------
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Inicialização do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Conectando ao Supabase...");

/*
|--------------------------------------------------------------------------
| LISTAR PRODUTOS (PEÇAS DE SKATE)
|--------------------------------------------------------------------------
*/

app.get("/produtos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pecas')
            .select('*');

        if (error) {
            console.error("Erro no Supabase:", error);
            return res.status(500).json({
                erro: "Erro ao buscar produtos no banco de dados"
            });
        }

        res.json(data);
    } catch (err) {
        console.error("Erro interno:", err);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
});

/*
|--------------------------------------------------------------------------
| CADASTRAR PRODUTO (PEÇAS DE SKATE)
|--------------------------------------------------------------------------
*/

app.post("/produtos", async (req, res) => {
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

    try {
        const { data, error } = await supabase
            .from('pecas')
            .insert([
                {
                    tipo_produto,
                    modelo_produto,
                    nome_produto,
                    marca_produto,
                    tamanho_produto,
                    cor_produto,
                    preco_produto,
                    img_produto
                }
            ])
            .select();

        if (error) {
            console.error("Erro ao inserir:", error);
            return res.status(500).json({
                erro: "Erro ao cadastrar produto"
            });
        }

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            produto: data[0]
        });
    } catch (err) {
        console.error("Erro interno:", err);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
});

/*
|--------------------------------------------------------------------------
| LISTAR ROUPAS
|--------------------------------------------------------------------------
*/

app.get("/roupas", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('roupas')
            .select('*');

        if (error) {
            console.error("Erro no Supabase:", error);
            return res.status(500).json({
                erro: "Erro ao buscar roupas no banco de dados"
            });
        }

        res.json(data);
    } catch (err) {
        console.error("Erro interno:", err);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
});

/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO DO SERVIDOR
|--------------------------------------------------------------------------
*/

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});