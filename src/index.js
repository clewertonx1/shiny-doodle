const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksrepositorieExists(request, response, next){
  const { id } = request.params;

  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  const repository = repositories[repositoryIndex]

  if(!repository){
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repository = repository
  request.repositoryIndex = repositoryIndex
  return next()

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository)
  return response.json(repository);
});

app.put("/repositories/:id", checksrepositorieExists, (request, response) => {
  const {title: newTitle, url: newUrl, techs: newTechs} = request.body;
  const {repository} = request

  if(newTitle){
    repository.title = newTitle
  }
  if(newUrl){
    repository.url = newUrl
  }
  if(newTechs){
    repository.techs = newTechs
  }

  return response.json(repository);
});

app.delete("/repositories/:id", checksrepositorieExists, (request, response) => {
  const {repositoryIndex} = request
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checksrepositorieExists,(request, response) => {
  
  const {repository} = request

  repository.likes = repository.likes + 1

  return response.json(repository);
});

module.exports = app;
