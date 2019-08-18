import File from '../models/Files';

class FileController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;
    const file = await File.create({ name, path });
    return res.json({ file });
  }
}
export default new FileController();
