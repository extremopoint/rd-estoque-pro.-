let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
let editando = -1;

function login(){
  const u = document.getElementById('user').value;
  const p = document.getElementById('pass').value;

  if(u === 'admin' && p === '1234'){
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    render();
  }else{
    alert('Usuário ou senha inválidos');
  }
}

function salvar(){
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function dinheiro(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function adicionar(){
  const nome = document.getElementById('nome').value.trim();
  const qtd = parseInt(document.getElementById('qtd').value);
  const preco = parseFloat(document.getElementById('preco').value);

  if(!nome || !qtd || isNaN(preco)){
    alert('Preencha os campos');
    return;
  }

  if(editando >= 0){
    produtos[editando] = {nome,qtd,preco};
    editando = -1;
  }else{
    produtos.push({nome,qtd,preco});
  }

  salvar();
  limpar();
  render();
}

function editar(i){
  document.getElementById('nome').value = produtos[i].nome;
  document.getElementById('qtd').value = produtos[i].qtd;
  document.getElementById('preco').value = produtos[i].preco;
  editando = i;
}

function excluir(i){
  if(confirm('Excluir produto?')){
    produtos.splice(i,1);
    salvar();
    render();
  }
}

function limpar(){
  nome.value = '';
  qtd.value = '';
  preco.value = '';
}

function render(){
  const busca = document.getElementById('busca').value.toLowerCase();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  let qtdTotal = 0;
  let valorTotal = 0;
  let baixo = 0;

  produtos
    .filter(p=>p.nome.toLowerCase().includes(busca))
    .forEach((p,i)=>{
      qtdTotal += p.qtd;
      valorTotal += p.qtd * p.preco;
      if(p.qtd < 10) baixo++;

      lista.innerHTML += `
        <tr>
          <td>${p.nome}</td>
          <td>${p.qtd}</td>
          <td>${dinheiro(p.preco)}</td>
          <td>${dinheiro(p.qtd*p.preco)}</td>
          <td class="acao">
            <button class="editar" onclick="editar(${i})">Editar</button>
            <button class="excluir" onclick="excluir(${i})">Excluir</button>
          </td>
        </tr>
      `;
    });

  totalProdutos.innerText = produtos.length;
  totalQtd.innerText = qtdTotal;
  totalValor.innerText = dinheiro(valorTotal);
  baixo.innerText = baixo;
}

function exportar(){
  let csv = 'Produto,Quantidade,Preco,Total\\n';

  produtos.forEach(p=>{
    csv += `${p.nome},${p.qtd},${p.preco},${(p.qtd*p.preco).toFixed(2)}\\n`;
  });

  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'estoque.csv';
  a.click();
}

function toggleTheme(){
  document.body.classList.toggle('light');
}
