# WEB-ANIME

<p align="center">
  <img src="https://animefire.plus/uploads/cmt/2845312_1687951782.webp"/>
</p>

## Descrição

Um webscrapper que pega os episódios de animes do site **AnimeFire** e os disponibiliza em forma de API.<br>
No momento só coloquei alguns animes de exemplo, em breve irei adicionar uma função de busca, para facilitar a procura e não precisar ficar salvando no arquivo *animes.json*.

## Stacks utilizadas

- Javascript
- Express
- Cheerio
- Axios

## Pré-Requisitos

- NodeJS (*eu usei a versão 20*)
- NPM
- Insonmia ou Postman (*eu usei o thunderclient, extensão do vscode*)

## Instalação

Clone o repositório

```bash
git clone https://github.com/Kurumi30/web-scraper-anime.git
```

Abra o projeto na sua IDE de preferência e instale as dependências.

```bash
npm i
```

## Uso

Para rodar o projeto, basta executar o comando:

```bash
npm start
```

## Rotas

- **/anime** - Retorna todos os animes disponíveis no arquivo animes.json.
- **/anime/search?q=** - Busca por animes em geral
- **/anime/:anime** - Retorna todos os episódios do anime escolhido.

## Contribuição

Contribuição é sempre bem vinda, então se você tiver alguma ideia de melhoria, basta fazer um fork do projeto e criar uma pull request.

## Créditos

- [AnimeFire](https://animefire.plus/)

## Licença

[MIT](https://choosealicense.com/licenses/mit/)