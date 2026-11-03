const supabase = require('../config/database');

async function listarProdutos() {
    const { data, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) {
        console.log('Erro ao buscar produtos:', error.message);
        return [];
    }

    return data;
}

module.exports = {
    listarProdutos
};