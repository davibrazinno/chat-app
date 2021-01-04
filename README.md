# MERN: Full-stack Chat Application with Stock Market Bot

This project implements a MERN Char App with a Stock Market Bot. The bot is called by typing `/stock=googl.us` command from any chat, where `googl.us` is the stock option, and returns a message in the same chat exclusively for the user who sent the request. The backend processes the bot requests asynchronously, each request is sent to a message broker (RabbitMQ) and when it's processed the backend send a message using Socket.IO in order to update the chat with the Stock Bot response.

### How to use

Dependencies:
1. MongoDB running on port 27017
2. RabbitMQ running on port 6572

A Docker compose file is included for both dependencies, from the root dir run:
```
docker-compose up
```

To Install & Run the Backend, from /server dir run:
```
npm install
npm run server
```

To Install & Run the Frontend, from /client dir run:
```
npm install
npm start
```

---

Note:This project was bootstrapped from [chat-app](https://github.com/davehowson/chat-app) and updated to support the Stock Bot. The sections below are almost the same from the Chat App, expect by the updated Global Chat screenshot.

---

#### Introduction

The MERN stack which consists of **Mongo DB**, **Express.js**, **Node.js**, and **React.js** is a popular stack for building full-stack web-based applications because of its simplicity and ease of use. In recent years, with the explosive popularity and the growing maturity of the JavaScript ecosystem, the MERN stack has been the goto stack for a large number of web applications. This stack is also highly popular among newcomers to the JS field because of how easy it is to get started with this stack.
<br/><br/>
This repo consists of a **Chat Application** built with the MERN stack. I built this sometime back when I was trying to learn the stack and I have left it here for anyone new to the stack so that they can use this repo as a guide.
<br/><br/>
This is a full-stack chat application that can be up and running with just a few steps. 
Its frontend is built with [Material UI](https://material-ui.com/) running on top of React.
The backend is built with Express.js and Node.js.
Real-time message broadcasting is developed using [Socket.IO](https://socket.io/).

### Features

This application provides users with the following features
<br/>
* Authentication using **JWT Tokens**
* A **Global Chat** which can be used by anyone using the application to broadcast messages to everyone else.
* A **Private Chat** functionality where users can chat with other users privately.
* Real-time updates to the user list, conversation list, and conversation messages

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

