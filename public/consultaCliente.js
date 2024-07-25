document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();

    const form = document.getElementById('formConsulta');

    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        carregarClientes();
    });
});

async function carregarClientes(){
    try {
        const response = await fetch('/clientes');
        const data = await response.json();

        const tabelaClientes = document.getElementById('tabelaClientes');
        tabelaClientes.innerHTML = '';

        data.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.bday}</td>
            <td>${cliente.celular}</td>
            <td>${cliente.endereco}</td>
            <td>${cliente.sexo}</td>
            `;
            tabelaClientes.appendChild(row);
        });
    } catch (error) {
        console.log('Erro ao carregar solicitação:', error);
    }
}