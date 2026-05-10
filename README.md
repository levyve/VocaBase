# Vocaloid DataBase
Um projeto simples de API com um banco de dados pequeno de vocaloids
Feito para a inscrição na empresa CEOS jr da UFC

## Primeiros Passos
 1. Clone o repositório:  
   `git clone https://github.com/levyve/VocaBase.git`
 2. Baixe as dependências:  
   `npm install -D @types/node@^25.6.0 prisma@6.19.0 tsx@^4.21.0 typescript@^6.0.3`
 3. Gere o Prisma Client:  
    `npx prisma generate`
 4. Inicie o server:  
     `node --watch server.js`
 6. Abra o arquivo index

## Dentro do Site
Dentro do site há os 4 métodos HTTP:  
GET, POST, PUT, DELETE  
Para acessar cada um deles, navegue pela barra lateral na esquerda.  

O site conta com o MongoDB para gerenciar o banco de dados do servidor, mas é necessário hospedar o servidor localmente  

## GET
ao acessar o método GET  
o site disponibilizará todos os vocaloids registrados no banco de dados ordenados alfabeticamente  
## POST
Ao acessar o método POST  
Preencha todas informações necessárias, o nome será a identificação do seu vocaloid  
Não coloque símbolos ou letras na aba de RELEASE, este é apenas o ano que seu vocaloid foi lançado  
Na aba de VERSIONS, marque quais versões seu vocaloid tem  
Após tudo, clique em enviar, e o vocaloid será posto no banco de dados  
## PUT
Ao acessar o método PUT  
tenha em mente que o nome do vocaloid não é modificável, pois ele é a identificação do vocaloid  
Preencha com o nome do vocaloid cuja informação você quer mudar  
e então coloque todas as novas informações  
## DELETE
Ao acessar o método DELETE  
preencha com o nome do vocaloid que você quer deletar  
caso erre o nome de um vocaloid ao postar ele, deletar é a melhor opção  

# Créditos
VOCALOID HD Wallpaper by Rikko (Artist) #1277186 - Zerochan Anime Image Board   
Apenas foi usado Inteligência artificial para correção de bugs, claude.ai.

### adicional
O código pode estar meio mal otimizado pela falta de tempo e experiência:p  
mas foi feito com esforço, primeira API que eu fiz.
