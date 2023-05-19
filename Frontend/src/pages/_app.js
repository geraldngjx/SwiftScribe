import "@/styles/globals.css";
import Navbar from "../components/navigation/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <div className="flex">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main-content flex-1">
        <Component {...pageProps} />
      </div>
    </div>
  );
}