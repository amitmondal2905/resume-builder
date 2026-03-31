import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json"

const Loader = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div style={{ width: 150 }}>
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>
    </>
  );
};

export default Loader;
