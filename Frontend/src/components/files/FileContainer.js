import React from "react";
import FileRow from "./FileRow";

function FileContainer({ logs }) {
  return (
    <div
      className="bg-[#171738] rounded-lg shadow p-8 overflow-y-scroll h-full"
      style={{ maxHeight: "400px" }}
    >
      <div className="mb-4 flex flex-col justify-between">
        <div className="text-sm text-[#9e9d9d] uppercase tracking-wide">
          Recent Files
        </div>
        <div>
          {logs.map((log, index) => (
            <FileRow key={index} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileContainer;
