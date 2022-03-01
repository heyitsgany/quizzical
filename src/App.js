import React from "react";

import Splash from "./components/Splash";
import Quiz from "./components/Quiz";

export default function App() {
  // SIMPLE TOGGLE TO ALLOW FOR SPLASH SCREEN ON FIRST USE
  const [gameStarted, setGameStarted] = React.useState(false);

  function startQuiz() {
    setGameStarted(true);
  }

  return (
    <main className="main">
      {!gameStarted && <Splash handleClick={startQuiz} />}
      {gameStarted && <Quiz />}
    </main>
  );
}
