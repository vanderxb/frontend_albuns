
const lista = document.getElementById('lista')


const apiUrl = 'http://localhost:3004/albuns';


let edicao = false;
let idEdicao = 0;


let titulo = document.getElementById('titulo');
let artista = document.getElementById('artista');
let imagem = document.getElementById('imagem');
let genero = document.getElementById('genero');
let nota = document.getElementById('nota');






const getAlbuns = async () => {
    
    const response = await fetch(apiUrl)
    
    const albuns = await response.json();

    console.log(albuns);

    
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




const submitForm = async (event) => {
    
    event.preventDefault();

    
    const album = {
        titulo: titulo.value,
        artista: artista.value,
        imagem: imagem.value,
        nota: parseInt(nota.value),
        genero: genero.value
        
    }
    

    if(edicao) {
        putAlbum(album, idEdicao);
    } else {
        createAlbum(album);
    }

    clearFields();
    lista.innerHTML = '';
}

const createAlbum = async(album) => {
    
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(album),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    
    const response = await fetch(request);

    const result = await response.json();
    
    alert(result.message)
    
    getAlbuns();

}

const putAlbum = async(album, id) => {
    
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(album),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    
    const response = await fetch(request);

    const result = await response.json();
    
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getAlbuns();
}



const deleteAlbum = async (id) => {
    
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    })

    const response = await fetch(request);
    const result = await response.json();

    alert(result.message);
    
    lista.innerHTML = '';
    getAlbuns();
}



const getAlbumById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}



const editAlbum = async (id) => {
    
    edicao = true;
    idEdicao = id;

  
    const album = await getAlbumById(id);

    
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
   
    const status = false
    const request = new Request(`${apiUrl}/${status}/${id}`, {
        method:  'PUT'
    })

   
    const response = await fetch(request);
    const result = await response.json();
      

    lista.innerHTML = '';
    getAlbuns();
}

const setTrue = async(id) => {
    
    const status = true
    const request = new Request(`${apiUrl}/${status}/${id}`, {
        method:  'PUT'
    })

    
    const response = await fetch(request);
    const result = await response.json();
    

    lista.innerHTML = '';
    getAlbuns();
}



getAlbuns();