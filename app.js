let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

function salvar(){
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function dinheiro(v){
  return v.toLocaleString('pt-BR',{
    style:'currency',
    currency:'BRL'
  });
}

function render(){
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  let qtdTotal = 0;
  let valorTotal = 0;
  let baixo = 0;

  produtos.forEach((p,i)=>{
    const total = p.qtd * p.preco;
    qtdTotal += p.qtd;
    valorTotal += total;
    if(p.qtd < 10) baixo++;

    lista.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.qtd}</td>
        <td>${dinheiro(p.preco)}</td>
        <td>${dinheiro(total)}</td>
        <td><button class="excluir" onclick="remover(${i})">Excluir</button></td>
      </tr>
    `;
  });

  document.getElementById('totalProdutos').innerText = produtos.length;
  document.getElementById('totalQtd').innerText = qtdTotal;
  document.getElementById('totalValor').innerText = dinheiro(valorTotal);
  document.getElementById('estoqueBaixo').innerText = baixo;
}

function adicionar(){
  const nome = document.getElementById('nome').value.trim();
  const qtd = parseInt(document.getElementById('qtd').value);
  const preco = parseFloat(document.getElementById('preco').value);

  if(!nome || !qtd || isNaN(preco)){
    alert('Preencha todos os campos');
    return;
  }

  produtos.push({nome,qtd,preco});
  salvar();
  render();

  document.getElementById('nome').value='';
  document.getElementById('qtd').value='';
  document.getElementById('preco').value='';
}

function remover(i){
  produtos.splice(i,1);
  salvar();
  render();
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

render();
