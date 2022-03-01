import React from "react";

export default function Splash(props) {
  return (
    <div className="splash">
      <h1 className="splash__heading">Quizzical</h1>
      <p className="splash__text">
        Welcome to Quizzical! In each game you'll be given five random questions
        to answer. Test your general knowledge and see how many you can answer
        correctly!
      </p>
      <button onClick={props.handleClick} className="button button--splash">
        Start quiz
      </button>
    </div>
  );
}
