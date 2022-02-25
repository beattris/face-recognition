import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onEnter }) => {
  return (
    <div>
      <p className="f3">
        {"This magic brain will detect faces in your pictures. Give it a try!"}
      </p>
      <div className="center">
        <div className="center form pa4 br3 shadow-2">
          <input
            type="text"
            className="f4 pa2 w-70 center"
            onChange={onInputChange}
            onKeyDown={onEnter}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
