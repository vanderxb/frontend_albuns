// buscar o elemento no html da minha lista onde irei inserir as vagas
const lista = document.getElementById('lista')

// atribuindo a endpoint da api do backend em um constante
const apiUrl = 'http://localhost:3004/albuns';

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// pegar os dados que o usuario digita no input (Elementos)
let titulo = document.getElementById('titulo');
let artista = document.getElementById('artista');
let imagem = document.getElementById('imagem');
let genero = document.getElementById('genero');
let nota = document.getElementById('nota');





// faz uma resquisicao do tipo [GET] para o back que recebe todas as vagas cadastradas
const getAlbuns = async () => {
    // FETCH API api do javascript responsavel por fazer comunicacao entre requicoes http.
    // faz uma requisicao [GET] para o backend na url http://localhost:3000/vagas
    const response = await fetch(apiUrl)
    // é a lista de objetos vagas (array de objetos)
    const albuns = await response.json();

    console.log(albuns);

    // a gente pega o resultado da api(um array de objetos com as vagas) e itera essa lista com o map
    // algo parecido com um for.
    albuns.map((album) => {
        if(album.status === false){
            lista.insertAdjacentHTML('beforeend', `
        <div class="col-lg-4 mb-5 mb-lg-0">
            <div class="card">
                <img src="${album.imagem}">
                <div class="card-body">
                    <h2 class="h4 fw-bolder">${album.titulo}</h2>
                    <h6>${album.artista}</h6>
                    <span class="badge bg-primary">${album.genero}</span>
                    <p class="card-text"> ${album.nota} &#9733; </p>
                    <h2><i id="headphones" class="bi bi-headphones" style="color:${album.statuscolor}"></i></h2>
                    <div>
                        <input type="radio" onchange= "setFalse('${album.id}')" id="huey" name="${album.id}" value="false"
                        checked>
                        <label for="huey">Não Reproduzido</label>
                        <input type="radio" onchange= "setTrue('${album.id}')"id="dewey" name="${album.id}" value="true">
                        <label for="dewey">Reproduzido</label>
                        
                    </div>                    
                    <div>
                        <button class="btn btn-primary" onclick="editAlbum('${album.id}')">Editar</button>
                        <button class="btn btn-danger" onclick="deleteAlbum('${album.id}')">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
        
        `)
        }else{
            lista.insertAdjacentHTML('beforeend', `
        <div class="col-lg-4 mb-5 mb-lg-0">
            <div class="card">
                <img src="${album.imagem}">
                <div class="card-body">
                    <h2 class="h4 fw-bolder">${album.titulo}</h2>
                    <h6>${album.artista}</h6>
                    <span class="badge bg-primary">${album.genero}</span>
                    <p class="card-text"> ${album.nota} &#9733; </p>
                    <h2><i id="headphones" class="bi bi-headphones" style="color:${album.statuscolor}" onclick="putStatus('${album.id}')"></i></h2>
                    <div>
                        <input type="radio" onchange= "setFalse('${album.id}')" id="huey" name="${album.id}" value="false"
                        >
                        <label for="huey">Não Reproduzido</label>
                        <input type="radio" onchange= "setTrue('${album.id}')"id="dewey" name="${album.id}" value="true" checked>
                        <label for="dewey">Reproduzido</label>
                        
                    </div>                    
                    <div>
                        <button class="btn btn-primary" onclick="editAlbum('${album.id}')">Editar</button>
                        <button class="btn btn-danger" onclick="deleteAlbum('${album.id}')">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
        
        `)
        }
    })
}


// [POST] envia uma vaga para o backend para ser cadastrada

const submitForm = async (event) => {
    // previnir que o navegador atualiza a pagina por causa o evento de submit
    event.preventDefault();

    // Estamos construindo um objeto com os valores que estamos pegando no input.
    const album = {
        titulo: titulo.value,
        artista: artista.value,
        imagem: imagem.value,
        nota: parseInt(nota.value),
        genero: genero.value
        
    }
    // é o objeto preenchido com os valores digitados no input

    if(edicao) {
        putAlbum(album, idEdicao);
    } else {
        createAlbum(album);
    }

    clearFields();
    lista.innerHTML = '';
}

const createAlbum = async(album) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(album),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    // vaga cadastrada com sucesso.
    getAlbuns();

}

const putAlbum = async(album, id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(album),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getAlbuns();
}


// [DELETE] funcao que exclui um vaga de acordo com o seu id
const deleteAlbum = async (id) => {
    // construir a requiscao de delete
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    })

    const response = await fetch(request);
    const result = await response.json();

    alert(result.message);
    
    lista.innerHTML = '';
    getAlbuns();
}


// [GET] /Vaga/{id} - funcao onde recebe um id via paramtero envia uma requisicao para o backend
// e retorna a vaga de acordo com esse id.
const getAlbumById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}


// ao clicar no botao editar
// ela vai preencher os campos dos inputs
// para montar o objeto para ser editado
const editAlbum = async (id) => {
    // habilitando o modo de edicao e enviando o id para variavel global de edicao.
    edicao = true;
    idEdicao = id;

    //precismo buscar a informacao da vaga por id para popular os campos
    // salva os dados da vaga que vamos editar na variavel vaga.
    const album = await getAlbumById(id);

    //preencher os campos de acordo com a vaga que vamos editar.
    titulo.value = album.titulo;
    artista.value =  album.artista;
    imagem.value = album.imagem;
    nota.value = album.nota;
    genero.value = album.genero;
}


const clearFields = () => {
    titulo.value = '';
    artista.value = '';
    imagem.value = '';
    nota.value = '';
    genero.value = '';
}

const setFalse = async(id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const status = false
    const request = new Request(`${apiUrl}/${status}/${id}`, {
        method:  'PUT'
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);
    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.  

    lista.innerHTML = '';
    getAlbuns();
}

const setTrue = async(id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const status = true
    const request = new Request(`${apiUrl}/${status}/${id}`, {
        method:  'PUT'
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);
    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.  

    lista.innerHTML = '';
    getAlbuns();
}



getAlbuns();