const form = document.getElementById('formCadastro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const bday = document.getElementById('bday').value;
    const celular = document.getElementById('celular').value;
    const endereco = document.getElementById('endereco').value;
    const genero = document.getElementById('genero').value;


    const response = await fetch('/clientes', {
        method: 'POST',
        headers: {
            //define o cabeçalho da requisição para JSON
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({nome, bday, celular, endereco, genero}),
    });
    const data = await response.json();
    console.log('Cliente cadastrado:', data);
});