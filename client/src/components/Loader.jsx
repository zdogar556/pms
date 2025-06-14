import React from "react";

const Loader = () => {
  return (
    <div className="fixed bg-gray-800 bg-opacity-20 inset-0 z-50 flex justify-center items-center">
      <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
    </div>
  );
};

export default Loader;