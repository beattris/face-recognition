import React, { Component } from "react";
import Particles from "react-tsparticles";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

// const app = new Clarifai.App({
//   apiKey: '663965f3b68f4c82852fed5e1a2d2c33'
// });

const raw = JSON.stringify({
  "user_app_id": {
		"user_id": "n8ha1c21ofd6",
		"app_id": "face-detect"
	},
  "inputs": [
    {
      "data": {
        "image": {
          "url": "https://samples.clarifai.com/metro-north.jpg"
        }
      }
    }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Key 3caddf5109af4bdd94fd3b6330f28179'
  },
  body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id



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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: ""
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  };

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    // app.models.predict("663965f3b68f4c82852fed5e1a2d2c33", "https://samples.clarifai.com/face-det.jpg")
    // .then(
    //   function(response) {
    //     console.log(response);
    //   },
    //   function(err){
    //     // there was an error
    //   }
    // )
    fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
    .then(response => console.log(response))
    .then(result => console.log(JSON.parse(result, null, 2).outputs[0].data))
    .catch(error => console.log('error', error));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />      
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit}
        />
       <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
