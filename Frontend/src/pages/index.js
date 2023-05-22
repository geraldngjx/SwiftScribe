import React from "react";
import StatisticsContainer from "../components/files/StatisticsContainer";
import FileContainer from "../components/files/FileContainer";

function Dashboard() {
  const logs = [{
    filename: "file",
    wordCount: 250,
    date: "Date"
  }, 
  {
    filename: "file",
    wordCount: 250,
    date: "Date"
  }, 
  {
    filename: "file",
    wordCount: 250,
    date: "Date"
  }, 
  {
    filename: "file",
    wordCount: 250,
    date: "Date"
  }, 
  {
    filename: "file",
    wordCount: 250,
    date: "Date"
  }]

  return (
    <main className="h-screen pl-8 pr-12 bg-white">
      <h1 className="text-4xl font-bold py-8">My Dashboard</h1>
      <div className="flex justify-between mb-8">
        <StatisticsContainer title="Documents Summarised" value="13" />
        <StatisticsContainer title="Total Storage Used (GB)" value="2.37" />
      </div>
      <FileContainer logs={logs} />
    </main>
  );
}

export default Dashboard;