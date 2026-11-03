import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/ogkarmaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Carregar variáveis do .env
dotenv.config();

const app = express();

// Porta do servidor
const PORTA = process.env.PORTA || process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// configuração correta de pasta
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '1ogkarmaroupa.html'));
});

// Rotas de chat
app.use('/chat', chatRoutes);

/* Conexão com o SupaBase */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Inicialização do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Conectando ao Supabase...");

/* lista de peças */

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

/* cadastrar peças */

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

/* listagem de roupas */

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

/* inicializando o servidor */

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
