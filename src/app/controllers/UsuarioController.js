import * as Yup from 'yup';

import Usuario from '../models/Usuario';

import authConfig from '../../config/auth';

class UsuarioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: authConfig.validateMessage });
    }

    const usuarioExiste = await Usuario.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (usuarioExiste) {
      return res.status(400).json({ error: 'Email alread exists.' });
    }

    const { id, nome, email } = await Usuario.create(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      senhaAntiga: Yup.string().min(6),
      senhaNova: Yup.string()
        .min(6)
        .when('senhaAntiga', (senhaAntiga, field) =>
          senhaAntiga ? field.required() : field
        ),
      confirmacaoSenha: Yup.string()
        .min(6)
        .when('senhaNova', (senhaNova, field) =>
          senhaNova ? field.required().oneOf([Yup.ref('senhaNova')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: authConfig.validateMessage });
    }

    const { email, senhaAntiga } = req.body;

    const usuario = await Usuario.findByPk(req.usuarioID);

    if (email && email !== usuario.email) {
      const usuarioExiste = await Usuario.findOne({
        where: {
          email,
        },
      });

      if (usuarioExiste) {
        return res.status(400).json({ error: 'Email alread exists.' });
      }
    }

    if (senhaAntiga && !(await usuario.checkPassword(senhaAntiga))) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    const usuarioAtualizado = await usuario.update(req.body);

    return res.json({
      id: usuarioAtualizado.id,
      name: usuarioAtualizado.name,
      email: usuarioAtualizado.email,
      provider: usuarioAtualizado.provider,
    });
  }
}

export default new UsuarioController();
