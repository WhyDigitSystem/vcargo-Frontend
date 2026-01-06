// src/components/common/SafeAutocomplete.jsx
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const SafeAutocomplete = ({ children, onLoad, onPlaceChanged, ...props }) => {
  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) {
    return (
      <div className="w-full">
        <div className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center">
          <span className="text-sm text-gray-500">Loading maps...</span>
        </div>
      </div>
    );
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} {...props}>
      {children}
    </Autocomplete>
  );
};

export default SafeAutocomplete;