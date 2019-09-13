import Mongoose from 'mongoose';

const NotificationSchema = new Mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      // assim que iniciar a notificação o padrão ela vai ser false, pois é não lida.
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model('Notification', NotificationSchema);
