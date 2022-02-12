import React, { Component } from "react";
import Particles from "react-tsparticles";
// import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
// import Apicall from "./components/Apicall/Apicall";
import "./App.css";

const particlesOptions = {
  fpsLimit: 60,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

const initialState = {
  input: "",
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    // password: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      // password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0]
      .region_info.bounding_box;
      console.log(clarifaiFace)
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onEnter = (event) => {
    if (event.key === 'Enter') {
      this.onButtonSubmit();
    }
  }

  onButtonSubmit = () => {
    // this.setState({ imageUrl: this.state.input });
    const raw = JSON.stringify({
      user_app_id: {
        user_id: "n8ha1c21ofd6",
        app_id: "face-detect",
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });

    fetch(
      "https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key 3caddf5109af4bdd94fd3b6330f28179",
        },
        body: raw,
      }
    )
    .then((response) => response.text())
    .then((response) => {
      if (response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        });
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch((error) => console.log('error', error));
      // .then((response) => response.text())
      // .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
      // .catch((error) => console.log("error", error));
  };

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route : route});
  }

  render() {
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
         ? 
          <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            onEnter={this.onEnter}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.input} />
          </div>
          : (
            this.state.route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    );
  }
}

export default App;
