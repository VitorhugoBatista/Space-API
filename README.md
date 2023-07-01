# Space-API
Essa API permite gerenciar estações espaciais e recargas de naves espaciais.


#Tecnologias usadas
Apollo
Node.js
Express
GraphQL
MongoDB
Mongoose (ODM para MongoDB)
ESLint (linting)
Jest (testes)


#Instalação e inicialização da aplicação

#npm install

#npm start

#Usando docker compose

docker-compose up


#Estrutura
/models - Modelos Mongoose para Station, Recharge, Reservation, etc.
/resolvers - Resolvers GraphQL
/schema - Schema GraphQL
/context - fornece o contexto de usuário e autorização
/helpers - Fornece a tratativa customizada de erros

#Uso

#Autenticação
Para autenticar com a API, é preciso primeiro criar um usuário por meio da mutation signup. Aqui está um exemplo dessa mutation em GraphQL:

mutation {
  signup(input: {email: "seuEmail", password: "suaSenha", fname: "SeuNome", lname: "SeuSobrenome"}) {
    userJwtToken {
      token
    }
  }
}
Depois de executar essa mutation, o servidor retornará um token JWT. Esse token deve ser incluído no cabeçalho Authorization de todas as solicitações subsequentes, da seguinte forma:

Authorization: Bearer seuToken
Se a mutation for bem-sucedida, você receberá uma resposta semelhante a esta:


{
  "data": {
    "signup": {
      "userJwtToken": {
        "token": "seuToken"
      }
    }
  }
}

Guarde o valor do campo token para usar nas solicitações subsequentes. Lembre-se de substituir "seuToken" pelo valor real do token nas suas solicitações.

Mutations
login(input: LoginInput): UserWithToken
Esta mutation é usada para fazer login como um usuário existente. A entrada é um LoginInput que contém o email e a senha do usuário. A mutation retorna um UserWithToken que inclui as informações do usuário e um token JWT.

signup(input: SignupInput): UserWithToken
Esta mutation é usada para criar um novo usuário. A entrada é um SignupInput que contém detalhes como email, senha e nome do usuário. A mutation retorna um UserWithToken, que inclui as informações do usuário e um token JWT.

reservation(input: ReservationInput): Reservation
Esta mutation é usada para criar uma nova reserva. A entrada é um ReservationInput que contém os detalhes da reserva como o ID da estação e os horários de início e término da reserva. A mutation retorna uma Reservation que inclui os detalhes da reserva.

installStation(input: CreateStationInput!): Station
Esta mutation é usada para criar uma nova estação espacial. A entrada é um CreateStationInput que contém os detalhes da estação como o nome e o planeta onde a estação está localizada. A mutation retorna uma Station que inclui os detalhes da estação criada.

recharge(input: RechargeInput!): Recharge!
Esta mutation é usada para recarregar a estação espacial. A entrada é um RechargeInput que contém os detalhes da recarga como o ID da estação e o horário de término da recarga. A mutation retorna um Recharge que inclui os detalhes da recarga realizada.

Queries
suitablePlanets: [Planet]
Esta query retorna uma lista de planetas adequados para instalação de estações espaciais.

stations: [Station]
Esta query retorna uma lista de todas as estações espaciais.

stationHistory(stationId: ID!): [RechargeHistory!]!
Esta query retorna o histórico de recargas de uma estação espacial específica. A entrada é o ID da estação. A query retorna uma lista de RechargeHistory que contém detalhes de todas as recargas realizadas na estação.





Contribuindo
Pull requests são bem vindos! Por favor, siga o estilo de código existente e adicione testes para novas funcionalidades.

