// fazendo isso aqui para não precisar rodas junto com o core da aplicação
// a queue roda em outro terminal ou outro core
// precisa-se fazer o sucrase no script da aplicação
import Queue from './lib/Queue';

Queue.processQueue();
