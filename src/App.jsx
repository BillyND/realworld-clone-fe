import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import { Context } from "./Context";
import Layout from "./Layout";
import BackdropLoading from "./components/BackDropLoading";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const [userLogin, setUserLogin] = useState();
  const infoUser = localStorage.getItem("userLogin");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    infoUser && setUserLogin(JSON.parse(infoUser));
  }, []);

  return (
    <Context.Provider
      value={[userLogin, setUserLogin, isLoading, setIsLoading]}
    >
      <div className="app-container">
        <Header />
        <div className="content-app">
          <Layout />
        </div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      {isLoading && <BackdropLoading />}
      {/* <BackdropLoading /> */}
    </Context.Provider>
  );
}

export default App;
