import gql from "graphql-tag";

const api = gql`
  type Query {
    suitablePlanets: [Planet]
    stations: [Station]
    stationHistory(stationId: ID!): [RechargeHistory!]! 

  }
  input CreateStationInput {
    name: String!
    planet: String!
  }

  input RechargeInput {
    endDateTime: String!
    stationId: ID!
  }


  type Mutation {
    reservation(input: ReservationInput): Reservation
    installStation(input: CreateStationInput! ): Station
    recharge(input: RechargeInput!): Recharge!
  }

  type Reservation {
    id: ID!
    user: User!
    station: Station!
    startDateTime: String!
    endDateTime: String!
  }

  input ReservationInput {
    stationId: ID!
    startDateTime: String!
    endDateTime: String!
  }

  type Planet {
    id: ID!
    name: String!
    mass: Float!
    hasStation: Boolean!
  }



  type Station {
    id: ID!
    name: String!
    planet: String!
    createdAt: String!
    updatedAt: String!
  }

  type RechargeHistory {
    startDateTime: DateTime!
    endDateTime: DateTime!
    duration: Int! 
    user: User! 
  }

  type Recharge {
    id: ID!
    station: Station!
    user: User!
    endDateTime: String!
  }


`;
export default api;