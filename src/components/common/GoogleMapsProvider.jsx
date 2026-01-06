import { LoadScript } from "@react-google-maps/api";
import { useState } from "react";

const GOOGLE_LIBRARIES = ["places"];

const GoogleMapsProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
        "AIzaSyDpZlwlIVN_z5uJwMey404fA19Qn3c8fyI"
      }
      libraries={GOOGLE_LIBRARIES}   // ✅ use static constant
      onLoad={() => {
        console.log("Google Maps API loaded");
        setLoaded(true);
      }}
      onError={(e) => console.error("Google Maps failed", e)}
    >
      {loaded ? children : <div>Loading Maps...</div>}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
