// Função que realiza uma busca de CEP utilizando a API externa.
// Obtém o valor do campo de entrada 'cep' do HTML, realiza uma solicitação fetch
// para a API e exibe os resultados na div com o id 'result'.
function buscaCep() {
  cep = document.getElementById("cep").value
  result = document.getElementById("result")
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res) => { return res.json() })
    .then((cep) => { result.innerHTML = mountList(cep) })
}

// Função que busca e preenche os estados (UFs) disponíveis. Realiza uma solicitação fetch para a API de estados, preenche uma lista de opçõese as insere no elemento select com o id 'ufs'.
function buscaUF() {
  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
    .then((res) => { return res.json() })
    .then((ufs) => {
      console.log('estados', ufs)
      list = "<option selected>Selecione o estado</option>"
      for (let uf of ufs) {
        list += `<option value="${uf.id}-${uf.sigla}">${uf.nome}</option>`
      }
      $("#ufs").html(list)
    })
}
// Chama a função de busca de UFs ao carregar a página
buscaUF()

// Função chamada quando ocorre uma mudança no campo de seleção de UF.
// Obtém o valor selecionado, extrai o ID do estado e realiza uma solicitação
// fetch para obter as cidades correspondentes à UF selecionada.
// Preenche o elemento select de cidades com as opções disponíveis.
function mudarUF(e) {
  console.log(e.target.value)
  uf = e.target.value.split("-")[0]
  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then((res) => { return res.json() })
    .then((cidades) => {
      console.log(cidades)
      listcidade = "<option selected>Selecione a cidade</option>"
      for (let cidade of cidades) {
        listcidade += `<option value="${cidade.nome}">${cidade.nome}</option>`
      }
      $("#cidades").html(listcidade)
    })
}

// Função que limpa o conteúdo da div 'result'.
function limparResultado() {
  result = document.getElementById("result")
  result.innerHTML = ""
}

// Função que remove os três primeiros caracteres da string.
function removerPrimeirosCaracteres(sigla) {
  // Verificar se a sigla tem pelo menos 3 caracteres
  if (sigla.length >= 3) {
    // Remover os três primeiros caracteres
    return sigla.substring(3);
  } else {
    // Caso contrário, retornar a própria sigla
    return sigla;
  }
}

// Função que realiza uma busca de rua utilizando os valores selecionados para UF, cidade e rua. Obtém os valores dos campos de seleção e entrada, realiza uma solicitação fetch para a API e exibe os resultados na div 'result'.
function buscaRua() {
  // Obter os valores selecionados dos selects
  let uf = document.getElementById("ufs").value;
  let cidade = document.getElementById("cidades").value;
  let rua = document.getElementById("rua").value;
  let ufAbreviada = removerPrimeirosCaracteres(uf);

  console.log("UF selecionado:", uf);
  console.log("Cidade selecionada:", cidade);
  console.log("Rua digitada:", rua);

  result = document.getElementById("result")
  fetch(`https://viacep.com.br/ws/${ufAbreviada}/${cidade}/${rua}/json`)
    .then((res) => { return res.json() })
    .then((ceps) => { result.innerHTML = mountListRuas(ceps) })
}

// Função auxiliar para montar a lista de resultados de CEPs.
function mountList(cep) {
  list = ""

  list = `
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div>
		`
  return list
}

// Função auxiliar para montar a lista de resultados de ruas.
function mountListRuas(ceps) {
  list = []
  for (let cep of ceps) {
    list.push(`
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div><br>
		`)
  }


  return list.toString().replaceAll(",", "")
}
