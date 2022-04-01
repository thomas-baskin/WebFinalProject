# TODO
This todo is half a plan and half of a checklist of task left to do.

The chat itself is built so I mostly just need to implement location features.

Here are some notes from the assignment description:

    1. A user should be able to create a chat room at their current location.
        1.a. Once the room is created then the user is automatically put in that room.
    2. A user can join any chat room that they are near in real world space.
    3. Each user in the chat should be able to send messages and receive any messages sent by other users.
        3.a. A user should only see messages sent from the time they entered the chat room.
    4. The application should have a good looking, user friendly, interface.
    5. BONUS: display a map that shows the locations of chat rooms and let the user select a room from the map (5pts)

    Objectives

    1. Work with websockets.
    2. Use the browser geolocation API.
    3. Basic UI design

- [x] Have the x, y coordinates display on the client's webpage. This'll show that we have the geolocation API working.
    - [ ] Figure out how to calculate an x foot radius around a given x/y coordinate.
    - [ ] Create function which returns true or false to see if the chatroom is within the given radius.
    - [ ] Add a latitude and longitude to the chatroom model.
- [ ] First task is to add a location to a chat room in the model. What will this take? Figure out the best way to store a geolocation in a model.
