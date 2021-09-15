const form_add = document.getElementById("form-add")
const msg_erro = document.getElementById("msg_erro")
const table_list = document.getElementById("table_list")
const section_listagem = document.getElementById("gerar_lista")
// const section_list = document.querySelector("#list")
const div_conteiner_list = document.querySelector("#conteiner-list")
let trs = null


let is_btn_sortear_visible = false


let btn_sortear = null

function validarNome(nome) {
    let status = true
    msg_erro.innerHTML = ""

    if(nome == "") {
        msg_erro.innerHTML = `<i class="fas fa-exclamation-circle"></i> Por favor informe o nome do jogador!`
        status = false
    } else if (nome.length < 3) {
        msg_erro.innerHTML = `<i class="fas fa-exclamation-circle"></i> Por favor informe mais caractares`
        status = false
    }

    return status
}

function criarElemento(tagName, atributos = {}) {
    let elemento = document.createElement(tagName)

    // Adicionando as propriedades das tag
    for (let atributo in atributos) {
        elemento.setAttribute(atributo, atributos[atributo])
    }

    return elemento
}

function adicionar(jogadores_pos, pos) {

    let status = jogadores_pos.includes(pos)
    if(!status) {
        jogadores_pos.push(pos)
    }

    return !status
}


function InicializarVetor(tot_jogador) {
    let equipe = []
    // Preecher o vetor
    for(let i = 0; i < tot_jogador; i++) {
        equipe.push(0);
    }

    return equipe
}

// Criar as equipes de jogadores
function criarEquipes(tr_jogadores, jogador_pos, tot_jogador) {
    let equipes = []
    let equipe = InicializarVetor(tot_jogador)
    let tot = 0;


    console.log(jogador_pos)

    jogador_pos.forEach(function (pos) {

        equipe[tot] = tr_jogadores[pos].querySelectorAll("td")

        if(tot + 1 ==  tot_jogador) {
            equipes.push(equipe)
            equipe = InicializarVetor(tot_jogador)
            tot = 0
        } else {
            tot++
        }
    })

    return equipes
}


function mostrarJogadores(array_times) {
    

    const NOME = 0

    array_times.forEach(function (time , key) {
        // Criando a div de equipe
        let titulo = criarElemento("h3")
        titulo.innerHTML = `EQUIPE ${key + 1}`

        

        // Criando a div da equipe
        let div_equipe = criarElemento("div", {
            class: "opcao"
        })

        // div que guarda a listagem de jogadores
        let div_listagem_jogador = criarElemento("div", {
            class: "jogador"
        })

        // percorrendo por cada elemento da equipe
        time.forEach(function (jogador) {
            let div_jogador = criarElemento("div")
            div_jogador.innerHTML = `${jogador[NOME].innerHTML}`

            div_listagem_jogador.appendChild(div_jogador)
        })

        // Adicionando os elementos na DOM
        div_equipe.appendChild(titulo)
        div_equipe.appendChild(div_listagem_jogador)
        div_conteiner_list.appendChild(div_equipe)
        
    })
}


function sorteio(e) {

    div_conteiner_list.innerHTML = ""

    e.preventDefault()
    let qtd_jogadores = parseInt(document.getElementById("qtdID").value)
    let tr_jogadores = table_list.querySelectorAll("tr")
    let jogadores_array = Array.from(tr_jogadores)
    let qtd_times = parseInt(jogadores_array.length / qtd_jogadores)
    
    let tot_jogador_sorteado = 0;
    let qtd_total_jogadores = tr_jogadores.length
    let qtd_jogador_sotear = qtd_times * parseInt(qtd_jogadores)

    let array_times = []
    let jogadores_pos = []

   
    while(tot_jogador_sorteado < qtd_jogador_sotear && qtd_jogadores < 24 && qtd_jogadores > 0) {
        // Soteia os jogadores
        let pos = parseInt(Math.random() * qtd_total_jogadores)
        // console.log(pos)
        if (adicionar(jogadores_pos, pos)) {
            tot_jogador_sorteado++
        }
    }
    
    array_times = criarEquipes(tr_jogadores, jogadores_pos, Number(qtd_jogadores))

    mostrarJogadores(array_times)
}


function removeTD(pos) {
    let tr = table_list.querySelectorAll("tr")[pos]
    tr.parentNode.removeChild(tr)
    addRemover()
    mostrarTotal()
}


function addRemover() {
    trs =  table_list.querySelectorAll("tr")
    for(let i = 0; i < trs.length; i++) {
        trs[i].querySelector("td a").setAttribute("onclick", `removeTD(${i})`)

        // .addEventListener("click", function () {
        //     trs[i].parentNode.removeChild(trs[i])
        //     mostrarTotal()
        // }, false)
    }
    
}

function mostrarTotal() {
    let div_tot_jogador = document.querySelector("#total")
    div_tot_jogador.style.display = 'block'

    div_tot_jogador.innerHTML = ""

    let total = parseInt(table_list.querySelectorAll("tr").length)


    div_tot_jogador.innerHTML = `${total} jogador`
    if (total > 1) {
        div_tot_jogador.innerHTML += 'es'
    }

}

// Funcão que mostra o botao de loading
function mostrarLoading() {
    const div_load = document.querySelector("#load")

    const css_root = document.querySelector(":root")
    const rt = getComputedStyle(css_root)

    div_load.innerHTML = '<span class="load_gif"></span> Realizando Sorteio'
    div_load.style.display = 'flex'
    div_load.style.color = rt.getPropertyValue('--cor02')

    return div_load
}

function preparaSorteio(e) {
    let tot = 0;
    const load = mostrarLoading()

    let intervalo = setInterval(function () {
        if (tot < 50) {
            sorteio(e)
        } else {
            clearInterval(intervalo)
            load.innerHTML = `<i class="fas fa-check-circle"></i> Sorteado`
            load.style.color = 'green'
        }

        tot++
    }, 200)
}

form_add.onsubmit = e => {
    e.preventDefault()

    let nome = e.target.name.value

    if( validarNome(nome) ){

        let tr = criarElemento("tr")
        let td_nome = criarElemento("td")
        let td_acao = criarElemento("td")

        let a = criarElemento("a",)

        // Adicionando os elemento text
        td_nome.innerHTML = nome
        a.innerHTML = '<i class="fas fa-times"></i>'
        a.classList.add("botao")
        a.classList.add("delete")

          // Adicionando os elementos
        td_acao.appendChild(a)
        tr.appendChild(td_nome)
        tr.appendChild(td_acao)

        let filho = table_list.firstChild

        if(filho) {
            table_list.insertBefore(tr, filho)
        } else {
            table_list.appendChild(tr)
        }

        e.target.name.value = ""

        

        // Executa o sorteio
        document.querySelector("#btn_sortear").addEventListener("click", preparaSorteio, false)
    }

    

    mostrarTotal()
    addRemover()
}

table_list.addEventListener("click", function (e) {

}, false)


