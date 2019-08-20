import { Router } from 'express';

import UsuarioController from './app/controllers/UsuarioController';
import SessaoController from './app/controllers/SessaoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/usuarios', UsuarioController.store);
/* 
Exemplo
JSON: {
	"nome": "Rodrigo Lopes",
	"email": "rlopeslameira@gmail.com",
	"senha": "123456789"
}
*/

routes.post('/auth', SessaoController.store);
/* 
Exemplo de autenticação
JSON: {	
	"email": "rlopeslameira@gmail.com",
	"senha": "123456789"
}
*/

// Rotas que deverão verificar se o usuário está logado
routes.use(authMiddleware);
routes.put('/usuarios', UsuarioController.update);
/* 
Exemplo Alterando o E-mail
JSON: {
	"email": "rodrigolopes@gmail.com"	
}

AUTH: {
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY2MzI4OTE4LCJleHAiOjE1Njg5MjA5MTh9.gbY4vYSmc3nDJGbM4dJ3-sm7U0FEMbqMBQ-SJLhrDr
}
*/

export default routes;
