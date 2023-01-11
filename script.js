function novaTarefa(id) { //função cria tarefa
    this.id = id
    this.criaElementoHtml = criaElementoHtml
    this.alteraConteudo = alteraConteudo
}

function getValueForm(event) {
    event.preventDefault();
    // const listagem = document.querySelector('[lista]')                  
    // listagem.style.display = 'inline'
    if (event.target.value == 'adicionar'){
        const input = document.querySelector("#input-texto")
        let idDoDocumento = geradorId()
        return setValueForm(input.value, idDoDocumento)
    } else {
        const input = document.querySelector("#input-texto-editar")
        const id = event.target
        return setValueForm(input.value, id.value)
    }
}

function setValueForm(conteudo, id) {
    if(existeId(id)!=null ){ 
        alteraConteudo(id, conteudo)
    } else {
        const tarefa = new novaTarefa(id)
        document.querySelector('[lista]').appendChild(tarefa.criaElementoHtml(id,conteudo))
        contadorDeTarefas()
    }
}

// funções anônimas 
let ids = []
let id = 0
const geradorId = _ => {
    id += 1;
    ids.push(id)
    return id
}

const contadorDeTarefas = _ => {
    let tarefasTotal = document.querySelectorAll('.tarefas-total')
    tarefasTotal.forEach(x => {
        x.innerHTML = ids.length
    })
}

const removeIdTarefas = (id, nameArray) => {
    idInt =  parseInt(id)
    nameArray.splice(nameArray.indexOf(idInt), 1)
}


const criaElementoHtml = (id, conteudo) => {
    const novoElemento = document.createElement('div') //cria o elemento na DOM
    novoElemento.setAttribute('class', 'tarefas')
    novoElemento.innerHTML = `<p id=${id}><input type="checkbox" onclick='tarefaConcluida(${id});' class="concluida"/>` + conteudo + `</p>` + adicionaBotao(id)
    // novoElemento.innerHTML = '<input type="checkbox" class="concluida"/>' + conteudo + adicionaBotao(id)
    return novoElemento
}

const alteraConteudo = (id, conteudo) => {
    const elemento = document.getElementById(id).parentNode
    elemento.innerHTML = `<p id=${id}><input type="checkbox" onclick='tarefaConcluida(${id});' class="concluida"/>` + conteudo + `</p>` + adicionaBotao(id);
    mostraFormETarefas()
    return elemento
}

let tarefasConcluidas = []
const tarefaConcluida = (id) => {
    const texto = document.getElementById(id)
    const checkbox = texto.querySelector('.concluida')
    if(checkbox.checked) {
        texto.style.textDecoration = 'line-through'
        texto.style.fontStyle = 'italic'
        texto.style.color = '#666665'
        tarefasConcluidas.includes(id) ? true : tarefasConcluidas.push(id)
        atualizaTextoTarefasConcluidas()
    } else {
        texto.style.textDecoration = 'none'
        texto.style.fontStyle = 'normal'
        texto.style.color = 'white'
        removeIdTarefas(id, tarefasConcluidas)
        atualizaTextoTarefasConcluidas()
    }
}

const editarTarefa = event => { 
    event.preventDefault()
    let idPeloEvento = event.target
    const formulario = document.querySelector('[formulario-editar]')
    formulario.style.display = 'flex'
    escondeFormularioETarefasIndesejadas(idPeloEvento)
    const botao = formulario.querySelector('#botao-editar')
    botao.setAttribute("value", idPeloEvento.value)
    const texto = document.getElementById(event.target.value)
    texto.querySelector('.concluida').style.display = 'none'
    document.querySelector(`.ed${event.target.value}`).style.display = 'none'
}

const excluiTarefa = event => {
    event.preventDefault()
    let id = event.target
    document.getElementById(id.value).parentNode.remove()
    const formularioEditar = document.querySelector('[formulario-editar]')
    const formularioPrincipal = document.querySelector('.formulario')
    existeId(id.value)==null ? formularioEditar.style.display = 'none' : formularioEditar.style.display = 'flex'
    existeId(id.value)==null ? formularioPrincipal.style.display = 'flex' : formularioPrincipal.style.display = 'none'
    removeIdTarefas(id.value, ids)
    removeIdTarefas(id.value, tarefasConcluidas)
    contadorDeTarefas()
    atualizaTextoTarefasConcluidas()
}

const existeId = id => {
     return document.getElementById(`${id}`)    
}

const adicionaBotao = id => {
    return `<div class="button-action ed${id}">
                <button class="editar" value=${id} onclick="editarTarefa(event)">Editar</button>
                <button class="excluir" value=${id} onclick="excluiTarefa(event)">Excluir</button>
            </div>`
}   

const escondeFormularioETarefasIndesejadas = idPeloEvento => {
    document.querySelector('.formulario').style.display = 'none'
    ids.forEach(x => {
        idPeloEvento.value!=x ? document.getElementById(x).parentElement.style.display = 'none' : false
    })
}

const mostraFormETarefas = _ => {
    document.querySelector('.formulario').style.display = 'flex'
    document.querySelector('[formulario-editar]').style.display = 'none'
    let tarefas = document.querySelectorAll('.tarefas')
    tarefas.forEach(x => {
        x.style.display = 'flex'
    })
}

const atualizaTextoTarefasConcluidas = _ => {
    document.getElementById('tarefas-feitas').innerHTML = tarefasConcluidas.length
}

