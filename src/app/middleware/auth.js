// update
import jwt from 'jsonwebtoken';
// promisify pega uma função de callback e tansforma em uma função async await
// callback é uma função assincrona, pois só é executada quando o gatilhod e execução autorizar!!
import { promisify } from 'util';
import authorization from '../../config/auth';

export default async (req, res, next) => {
  const autHeader = req.headers.authorization;
  // token  não chegou \/
  if (!autHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  // splitando o token vindo do head
  const [, token] = autHeader.split(' ');
  // console.log(token, authorization);
  // try catch para o token, pois pode dar inválido
  try {
    // jwt.verify() , utilizando o promisify e mudou para async await
    const decodificado = await promisify(jwt.verify)(
      token,
      authorization.secret
    );
    // criar o userid, dentro da requisição de usuario
    req.userId = decodificado.id;
    return next();
  } catch (error) {
    res.status(401).json({ error: 'Token Inválido' });
  }
  return next();
};
