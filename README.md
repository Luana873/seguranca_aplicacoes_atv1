⚙️ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

Node.js (versão 18 ou superior)

npm ou yarn

PostgreSQL

Docker

Verifique se estão instalados:

node -v
npm -v
psql --version
docker --version

🗄️ Configuração da Aplicação

1. Abra o terminal no VS Code e clique na seta ao lado do ícone '+', 
selecione a opção 'Ubuntu', a aba ao lado mostrará o nome "wsl"

2. Conecte-se ao Docker;

Ao conectar-se ao Docker no terminal, inicializa-se a conexão com o banco de dados Postgres e frontend a partir do comando;

docker compose up --build

3. Digite o comando "npm i";
 O comando é necessário para instalar as dependências e bibliotecas cruciais para funcionamento do projeto.


