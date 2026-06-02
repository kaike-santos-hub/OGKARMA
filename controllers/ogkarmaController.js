import { GoogleGenerativeAI } from "@google/generative-ai";

const iniciarChat = async (req, res) => {
    try {
        const CHAVE_API = process.env.API_KEY;
        const mensagem = req.body.mensagem; //{mensagem: "Texto"}
        const historico = req.body.historico ? req.body.historico : [];

        const genAI = new GoogleGenerativeAI(CHAVE_API);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
                temperature: 0.5,
                topP: 0.5,
                // thinkingConfig: {
                //     thinkingLevel: ThinkingLevel.LOW,
                // },
                mediaResolution: 'MEDIA_RESOLUTION_LOW',
                systemInstruction: [
                    {
                        text: `Você é um atendente de uma skateshop.
                            Peças:
                            - Shapes de maple ou marfim
                            - Trucks de diversas marcas
                            - Rodas de diversas marcas
                            Roupas:
                            - Boné/Touca de diversas marcas
                            - Camisa de diversas marcas
                            - Calças de diversas marcas

                            Regras:
                            1. Seja breve e direto.
                            2. Se o cliente pedir algo fora do estoque diga que não temos.
                            3. Ao finalizar o pedido, solicite o endereço de entrega e forma de pagamento.
                            4. Calcule o valor automaticamente.
                            5. Considere o histórico de mensagens antes de responder.
                            6. Consulte os preços e os produtos no bd ou na página
                            `,
                    }
                ],
            });

        const chat = model.startChat({ history: historico });
        const resultado = await chat.sendMessage(mensagem);
        const resposta = resultado.response.text();
        
        res.status(200).json({
            resposta: resposta,
            novoHistorico: [
                ...historico,
                { role: "user", parts:[{text: mensagem}] },
                { role: "model", parts:[{text: resposta}] },
            ]
        });
        
    } catch (erro) {
        console.error("Erro: ", erro);
        res.status(500).json({erro: "Erro ao processar a mensagem", message: erro.message});
    }
}

export default {iniciarChat};