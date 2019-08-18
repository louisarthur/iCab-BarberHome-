// o multer é usado para uploads de arquivos, já que iremos usar a requisição e resposta através de jsons
// por json não se envia arquivos, por isso é necessário fazer as coisas abaixo!
import Multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // como o multer vai guardar o arquivos de imagem, pode-se guardar em CDN, servidores online para arquivos físico
  storage: Multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // o file name é básicamente como o arquivo irá ficar no sistema, já que estaremos utilizando um sistema físico.
    // não deixaremos o usuário escolher o nome da foto, pois pode duplicar a foto com o nomes identicos, ou ser colocado
    // caracteres não aceitáveis pelo sistema
    filename: (req, file, callback) => {
      // utiliza-se o cripto, para ele gerar caracteres aleatórios, utiliza-se o formato callback e não async/await
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);
        // poderia usar o file.originalname no final para concatenar, mas não irei usar, pois o arquivo pode conter caracteres
        // inaceitáveis pelo sistema, por isso vou usar só a extensão
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
