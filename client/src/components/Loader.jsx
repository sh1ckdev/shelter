
import PropTypes from "prop-types";

const Loader = ({ size = "h-5 w-5", className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`${size} border-3 border-pink-600 border-t-transparent rounded-full animate-spin`}
      ></div>
      <span className="ml-2 text-pink-600">Загрузка...</span>
    </div>
  );
};

Loader.propTypes = {
    size: PropTypes.string, 
    className: PropTypes.string,
  };

export default Loader;