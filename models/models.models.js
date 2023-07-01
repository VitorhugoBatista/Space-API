import { Schema, model } from 'mongoose';

const stationSchema = new Schema({
  name: String,
  planet: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const rechargeSchema = new Schema({
  startDateTime: Date,
  endDateTime: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  station: { type: Schema.Types.ObjectId, ref: 'Station' },
  reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
});

const reservationSchema = new Schema({
  station: { type: Schema.Types.ObjectId, ref: 'Station' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  startDateTime: Date,
  endDateTime: Date,
});

const Reservation = model('Reservation', reservationSchema);

const Station = model('Station', stationSchema);
const Recharge = model('Recharge', rechargeSchema);

export { Station, Recharge, Reservation };