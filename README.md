# MERN: Full-stack Chat Application with Stock Market Bot

This is a Chat App with a Stock Market Bot included. The bot is called by typing `/stock=googl.us` command from any chat, where `googl.us` is the stock option. It returns a message in the same chat exclusively for the user who sent the request. The backend process the bot requests asynchronously, each request is sent to a message broker (RabbitMQ), when it's processed the backend send a message using Socket.IO to update the chat with the Stock Bot response.

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
This project was developed as a 5 days challenge. Some paths were taken to deliver all the features stable in time. As future enhancements we have:

- Support stock-bot visibility configuration (private or public); 
- Support to include new bots;
- Include E2E tests with Cypress;
- Configure test coverage stats script and badges on README.md;
- Increase test coverage for stock-bot controller;
- Create unit tests for controllers messages and users;
- Create unit tests for services, utilities, validation;
- Create unit tests for the React components.
