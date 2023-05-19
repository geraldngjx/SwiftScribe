import React from "react";

function StatisticsContainer({ value, title }) {
  return (
    <div className={`bg-[#171738] rounded-lg shadow p-8 flex-grow-0 flex-shrink-0 w-1/2 mr-4`}>
      <div className={`text-3xl text-white font-bold mb-2`}>
        {value}
      </div>
      <div className="text-sm text-[#9e9d9d] uppercase tracking-wide">
        {title}
      </div>
    </div>
  )
}

export default StatisticsContainer;