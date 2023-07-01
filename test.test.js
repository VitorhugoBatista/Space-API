import apiresolvers from "./resolvers/api.resolver";
import { Station } from './models/models.models.js';

import axios from "axios";
import { jest } from '@jest/globals';


describe('resolvers', () => {
  describe('Query', () => {
    describe('suitablePlanets', () => {
      it('should return a list of suitable planets', async () => {
        const mockData = 'pl_name,pl_rade,st_rad,pl_bmassj,pl_orbper\nPlanet 1,1,1,10,365\nPlanet 2,1,1,15,365';
        axios.get = jest.fn().mockResolvedValueOnce({ data: mockData });
        Station.findOne = jest.fn().mockImplementation(({ name }) => {
          if (name === 'Planet 1') {
            return { _id: '1', name: 'Planet 1' };
          }
          return null;
        });

        const planets = await apiresolvers.Query.suitablePlanets();
        
        expect(planets).toEqual([
          {
            name: 'Planet 1',
            mass: "10",
            hasStation: false,
          },
          {
            name: 'Planet 2',
            mass: "15",
            hasStation: false,
          },
        ]);
      }, 30000);
    });
  });
});
    

