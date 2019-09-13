import Bee from 'bee-queue';
// entender o código de fila.
import EmailCancelamento from '../app/jobs/EmailCancelamento';
import RedisConfig from '../config/redis';
// o bee-queue é para formar uma fila para o envio de email, já que está com um tempo de
// req /res muito alto, e tiraremos o await, para que o usuário não fique esperando
// com isso, faremos uma fila
// para cada background job diferente, se cria uma fila...
// dê uma olhada no index.js do database é bem similar
// parece om models...
const jobs = [EmailCancelamento];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  // configurando a fila do EMail

  init() {
    // utilizando esse key e o handle estamos fazendo uma desestruturação
    jobs.forEach(({ key, handle }) => {
      // armazenando todos os jobs dentro da queues, no construtor, ela é
      // um dicionário.
      this.queues[key] = {
        bee: new Bee(key, {
          redis: RedisConfig,
        }),
        handle,
      };
    });
  }

  // adicionando os itens dentro da fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processando a fila
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      // utilizaremos o método on failed, para saber se o processo está dando um erro
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  // cajo hajá um erro no enfileiramento do email, ele chamará esse
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
