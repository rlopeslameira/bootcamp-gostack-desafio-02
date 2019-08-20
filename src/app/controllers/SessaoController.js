import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import Usuario from '../models/Usuario';

import authConfig from '../../config/auth';

class SessaoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: authConfig.validateMessage });
    }

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // console.log(id);

    if (!(await usuario.checkPassword(senha))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, nome } = usuario;

    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn,
      }),
    });
  }
}

export default new SessaoController();
