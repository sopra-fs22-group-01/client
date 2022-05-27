# Cards Against Humanity Online
This project contains everything you need to play a fun game of Cards Against Humanity online with your friends. Enjoy our twist to the game and try out the additional features such as custom cards, and supervotes. 
## Introduction
### Main Goal
This project's main goal is to enable players to play Cards Against Humanity online. Compared to the original Cards Against Humanity game, we also changed some of the original mechanics and added some additional fun features. By doing so we learned a lot about developing a web application and how to work efficiently in a group of 5.

### Motivation
Our general motivation for this project was to expand our knowledge about software development with experience and practice. We choose to create a card game which we all consider fun to play to help us stay motivated and keep morals up.

## Technologies
The technologies used to develop the server side of this project were the following:

-   WebStorm, IntelliJ and Visual Studio Code as IDEs
-   Git and GitHub for the version control and project organization
-   Heroku for the deployment
-   Node.js as JavaScript runtime environment

## Main Components
In our frontend code, we have four main components that are crucial for the game: View, Models, Ui components and Routing components. They are all contained in our [Main](/src/) folder. 
1.  The most important views (the follwing listing also describes the general flow through the application):
    1.  The [Welcome view](src/components/views/StartPage.js) that greets the users and leads them to the login/registration views respectively
    2.  The [Login view](src/components/views/Login.js) responsible for letting to users log into their account, and a very similar [Registration view](src/components/views/Registration.js) for the registration of new users.
    3.  The [Profile view](src/components/views/ProfilePage.js), providing the user to navigate to the [edit Profile view](src/components/views/EditProfile.js), to the [Statistics view](src/components/views/Statistics.js) of the profile, to the [Lobbies overview](src/components/views/JoinLobby.js) and also provides the possibility to log out and return to the [Login view](src/components/views/Login.js)
    4.  The [Lobbies overview](src/components/views/JoinLobby.js) that lets the user create new lobbies are join already present lobbies. <img src="https://user-images.githubusercontent.com/91260375/170558623-d770e333-95d2-4a32-8fbc-0328b105bd89.png" width=650>
    5.  The [Lobby view](src/components/views/Lobby.js), where the users can see the other players and create their own custom card for the game. <img src="https://user-images.githubusercontent.com/91260375/170559234-79c40f85-0327-4550-9421-6e91d8dc5be6.png" width=650>
    6.  The [Card selection view](src/components/views/Round.js), where the players select the cards they want to play. <img src="https://user-images.githubusercontent.com/91260375/170560319-b821abb6-12ef-4a47-ad64-aae0e037eae1.png" width=650>
    7.  The [Voting view](src/components/views/Voting.js), where the players can vote for the best played card. <img src="https://user-images.githubusercontent.com/91260375/170560372-dc776860-016b-4278-bb44-20de836b0de6.png" width=650>
    8.  The [Round winner view](src/components/views/Winner.js), where the winner(s) of the round is anounced and the winnig card combination is read to everyone. <img src="https://user-images.githubusercontent.com/91260375/170560441-ee93f5cf-6804-4ae5-9dfe-02ae05eb826e.png" width=650>
    9.  The [Match winner view](src/components/views/MatchRanking.js), where the winner of the match is announced. <img src="https://user-images.githubusercontent.com/91260375/170559865-fda30733-0755-4629-bfe0-ab9acdc9be09.png" width=650>

2.  The most important models:
    - The [Card model](src/models/Card.js)
    - The [User model](src/models/User.js)

3. The most important UI components:
    - A [Primary button](src/components/ui/PrimaryButton.js) as a big and prominent button 
    - A [Secondary button](src/components/ui/SecondaryButton.js) as a smaller and less prominet button that is only present if needed
    - A [Card button](src/components/ui/CardButton.js) as a card that can be used like a button

4. Our [Routing components](src/components/routing/routers/)

# Launch and Development
To help you get started with this application, in the following paragraph you will find all the important information on the used framework, what commands are used to build and run the project and how to run  tests.

## Getting started 

If you are new to React, CSS/SCSS and HTML, you might want to read through the following documentations and tutarials:

- React documentation [Docs](https://reactjs.org/docs/getting-started.html)
- React tutorial [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](https://www.w3schools.com/Css/), [SCSS](https://sass-lang.com/documentation/syntax), and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Next, there are two other technologies that you should look at:

* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) offers declarative routing for React. It is a collection of navigational components that fit nicely with the application. 
* [react-hooks](https://reactrouter.com/web/api/Hooks) let you access the router's state and perform navigation from inside your components.

## Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```npm install```

Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

### Build
 `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Testing
We did not implement any tests in our frontend. However if you decide to implement tests, you can run them with  `npm run test`. This launches the test runner in an interactive watch mode. Consult this documentation for more information: [running tests](https://facebook.github.io/create-react-app/docs/running-tests)

## Client deployement
For the deployement of the client, we recommend [Heroku](https://id.heroku.com/)

## External dependencies
This software makes use of the following third party libraries:
- [Webspeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
- [React icons library](https://react-icons.github.io/react-icons/)

## Roadmap
**Possible  features that new developers can add:**
- Accessible functionalities to personalize properties of matches, like the timers, how many points for the win are needed, and the number of supervotes each player gets.
- Multiple sets of Cards to choose from; for example a family friendly with less offensive and less sexual content could be added.

#Credit
> Thanks to Lucas Pelloni and Kyrill Hux for working on the template.
