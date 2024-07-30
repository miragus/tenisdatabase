document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();

    const formConsulta = document.getElementById('formConsulta');
    const formEdit = document.getElementById('formEdit');
    const formEditSection = document.getElementById('formEditSection');
    const cancelEdit = document.getElementById('cancelEdit');

    formConsulta.addEventListener('submit', async (e) => {
        e.preventDefault();
        carregarClientes();
    });

    cancelEdit.addEventListener('click', () => {
        formEditSection.style.display = 'none';
    });
});

async function carregarClientes() {
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
            <td>${cliente.genero}</td>
            <td>
                <button class="edit-btn" data-id="${cliente.id}">Editar</button>
                <button class="delete-btn" data-id="${cliente.id}">X</button>
            </td>
            `;
            tabelaClientes.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                await mostrarFormularioEdicao(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                await deletarCliente(id);
                carregarClientes(); // Atualiza a lista após a exclusão
            });
        });

    } catch (error) {
        console.log('Erro ao carregar solicitação:', error);
    }
}

async function mostrarFormularioEdicao(id) {
    try {
        const response = await fetch(`/clientes/${id}`);
        if (response.ok) {
            const cliente = await response.json();

            document.getElementById('editId').value = cliente.id;
            document.getElementById('editNome').value = cliente.nome;
            document.getElementById('editBday').value = cliente.bday;
            document.getElementById('editCelular').value = cliente.celular;
            document.getElementById('editEndereco').value = cliente.endereco;
            document.getElementById('editGenero').value = cliente.genero;

            document.getElementById('formEditSection').style.display = 'block';

            document.getElementById('formEdit').addEventListener('submit', async (e) => {
                e.preventDefault();
                await atualizarCliente({
                    id: document.getElementById('editId').value,
                    nome: document.getElementById('editNome').value,
                    bday: document.getElementById('editBday').value,
                    celular: document.getElementById('editCelular').value,
                    endereco: document.getElementById('editEndereco').value,
                    genero: document.getElementById('editGenero').value
                });
                document.getElementById('formEditSection').style.display = 'none';
                carregarClientes(); // Atualiza a lista após a edição
            });
        } else {
            console.log('Cliente não encontrado:', response.statusText);
        }
    } catch (error) {
        console.log('Erro ao carregar cliente para edição:', error);
    }
}

async function atualizarCliente(cliente) {
    try {
        await fetch(`/clientes/${cliente.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
    } catch (error) {
        console.log('Erro ao atualizar cliente:', error);
    }
}

async function deletarCliente(id) {
    try {
        await fetch(`/clientes/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.log('Erro ao deletar cliente:', error);
    }
}
