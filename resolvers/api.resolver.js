import { Station, Recharge, Reservation } from '../models/models.models.js';
import axios from 'axios';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { G, MJ_TO_KG, RJ_TO_M } from './constants.js';
import User from '../models/user.model.js';
import context from '../context/context.js';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';


const apiresolvers = {
  Query: {
    suitablePlanets: async() => {
      const url =
                "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,st_rad,pl_bmassj,pl_orbper+from+pscomppars+where+pl_bmassj+is+not+null+and+st_rad+is+not+null+order+by+pl_bmassj+desc&format=csv";
      const response = await axios.get(url);

      const results = [];
      const planets = [];
      const readable = Readable.from(response.data);
      const parsePromise = new Promise((resolve) => {
        readable
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve());
      });

      await parsePromise;

      for (let planetData of results) {
        const g =
                    (G * planetData.pl_bmassj * MJ_TO_KG) /
                    (planetData.pl_rade * RJ_TO_M * planetData.pl_rade * RJ_TO_M);

        if (g > 10) {
          const station = await Station.findOne({
            planet: planetData.pl_name,
          });

          planets.push({
            name: planetData.pl_name,
            mass: planetData.pl_bmassj,
            hasStation: !!station,
          });
        }
      }

      return planets;
    },

    stations: async() => {
      return await Station.find();
    },

    stationHistory: async(_, { stationId }) => {
      const station = await Station.findById(stationId);
      const recharges = await Recharge.find({ station: station.id }).sort({ 
        startDateTime: 1 
      });
      
      const history = recharges.map(recharge => {
        return {
          startDateTime: recharge.startDateTime,
          endDateTime: recharge.endDateTime,
          duration: 
            recharge.endDateTime.getTime() - recharge.startDateTime.getTime(),
          user: {
            id: recharge.user.toString(),
          }
        };
      });
      
      return history;
    }
  

  },
  Mutation: {
    installStation: async(_, { input }) => {
      const { name, planet } = input;
      console.log(input);
      if (!name || !planet) {
        throw new ErrorTypes.BAD_USER_INPUT('Os campos name e planet precisam ser preenchidos!');
      }
      
      const createdStation = new Station({
        name,
        planet,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      try {
        await createdStation.save();
        return createdStation;
      } catch (error) {
        throw new Error('Erro ao gravar');
      }
    },
    recharge: async(_, { input }, context) => {
      const userId = context.userId;
            
      let reservation;
      if (input.reservationId) {
        // Verificar se há uma reserva para a recarga informada
        reservation = await Reservation.findById(input.reservationId);
        if (!reservation) {
          throw new Error("Reserva não encontrada"); 
        }
            
        // Verificar se a recarga está dentro do intervalo da reserva
        if (input.endDateTime < reservation.startDateTime || input.endDateTime > reservation.endDateTime) {
          throw new Error("Data de término da recarga fora do intervalo da reserva");
        }
      }
            
      // Checar se já existe uma recarga para a estação que ainda não terminou
      const existingStationCharge = await Recharge.findOne({
        station: input.stationId,
        endDateTime: { $gte: new Date() },
      });
            
      if (existingStationCharge) {
        throw new Error("Uma recarga já está em progresso para esta estação");
      }
            
      // Checar se o usuário já tem uma recarga em andamento
      const existingUserCharge = await Recharge.findOne({
        user: userId,
        endDateTime: { $gte: new Date() },
      });
            
      if (existingUserCharge) {
        throw new Error("Usuário já tem uma recarga em progresso");
      }
            
      try {
        const station = await Station.findById(input.stationId);
    
            
        const charge = await Recharge.create({
          startDateTime: new Date(),
          endDateTime: input.endDateTime,
          user: userId,
          station: station.id,
          reservation: reservation?.id 
        });
            
        console.log(charge);
        return charge;
      } catch (error) {
        console.log(error);
      } 
    },

    reservation: async(_, { input }, context) => {

      const userId = context.userId;


      const station = await Station.findById(input.stationId);
  
      // Verificar se há conflito com recargas e reservas existentes
      const existingChargeOrReservation = await Recharge.findOne({
        station: station._id,
        startDateTime: { $lte: input.startDateTime},
        endDateTime: { $gte: input.endDateTime },
      });
  
      if (existingChargeOrReservation) {
        throw new Error("Conflict with an existing charge or reservation");
      }

      const existingReservation = await Reservation.findOne({
        user: userId,
        startDateTime: { $lte: input.startDateTime },
        endDateTime: { $gte: input.endDateTime },
      });

      if (existingReservation) {
        throw new Error("Usuário já tem uma reserva em andamento");
      }

      const reservation = await Reservation.create({
        user: userId,
        station: station._id,
        startDateTime: input.startDateTime,
        endDateTime: input.endDateTime,
      });
  
      return reservation;
    },


  }};

export default apiresolvers;