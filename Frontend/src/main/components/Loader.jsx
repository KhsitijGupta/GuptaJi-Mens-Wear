import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../Assests/lotties/loading (1).json";   //add your JSON here

const Loader = ({ size = 150 }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <Lottie
        loop
        animationData={loadingAnimation}
        play
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Loader;