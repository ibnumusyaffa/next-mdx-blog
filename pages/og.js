import React from "react";

function Og() {
  return (
    <div className="w-1/2 h-[400px]  bg-gradient-to-r from-black to-blue-900">
      <div className="flex-1 flex flex-col h-full p-10 space-y-5 justify-end">
        <div>
          <div className="text-white  text-4xl mt-5">
            Panduan Ringkas Error Handling di Go
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div>
            <img
              className="w-10 h-10 rounded-full"
              src="https://avatars.githubusercontent.com/u/19760223?v=4"
            ></img>
          </div>
          <div>
            <div className="text-xl text-gray-100">Ibnu Musyaffa</div>
          </div>
        </div>
      </div>
      {/* <div className="bg-blue-500 h-1.5 w-full"></div>/ */}
    </div>
  );
}

export default Og;
