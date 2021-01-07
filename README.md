# MERN: Full-stack Chat Application with Stock Market Bot

This project implements a MERN Char App with a Stock Market Bot. The bot is called by typing `/stock=googl.us` command from any chat, where `googl.us` is the stock option, and returns a message in the same chat exclusively for the user who sent the request. The backend processes the bot requests asynchronously, each request is sent to a message broker (RabbitMQ) and when it's processed the backend send a message using Socket.IO in order to update the chat with the Stock Bot response.

### How to use

#### Docker way

This project is Dockerized, React Frontend, NodeJS Backend, MongoDB, and RabbitMQ are included.

![Docker Containers](https://user-images.githubusercontent.com/76712257/103848560-6b87d780-5081-11eb-8026-c616cacc4db4.png)

To start all the containers run:
```
docker-compose up
```

Wait until the containers start, then access the app on http://localhost:3000/

#### Manual way

###### Dependencies

Install & Start the Dependencies:
1. MongoDB should be running on port 27017
2. RabbitMQ should be running on port 5672

###### Backend (/server)

- Install: `npm install`
- Run: `npm run server`
- Test: `npm test`

###### Frontend (/client)

- Install: `npm install`
- Run: `npm start`
- Test: `npm test` (no unit tests available)

### Features

This application provides users with the following features
<br/>
* Authentication using **JWT Tokens**.
* A **Global Chat** which can be used by anyone using the application to broadcast messages to everyone else.
* A **Private Chat** functionality where users can chat with other users privately.
* Real-time updates to the user list, conversation list, and conversation messages.
* A **Stock Bot** `/stock=CODE` where the CODE is the stock option (Ex. AAPL.US, GOOGL.US).

#### Screenshots

##### Global Chat
![Global Chat](https://user-images.githubusercontent.com/76712257/103496740-1009df80-4e1e-11eb-8347-18185a713dac.png)

<br/><br/>
##### Private Chat
![Private Chat](https://i.imgur.com/jdCBYu4.png)
<br/><br/>
##### Login
![Login](https://i.imgur.com/6iobucn.png)
<br/><br/>
##### Register
![Register](https://i.imgur.com/AMkpl9C.png)

### Known Limitations

- Incomplete Docker configuration...?
- No E2E test coverage
- Backend: no unit test coverage for services, utilities, validation
- Frontend: no unit test coverage
