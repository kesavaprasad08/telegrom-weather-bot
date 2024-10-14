import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings(props) {
  const [apiKey, setApiKey] = useState("");
  const [botToken, setBotToken] = useState("");
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [botTokenResponseMessage, setBotTokenResponseMessage] = useState("");
  const navigate = useNavigate();
  const logoutHandler = () => {
    props.onLogout();
    navigate("/");
  };

  useEffect(()=>{
    if(!props.isLoggedIn){
        navigate("/")
    }
  },[])

  const handleUpdateOpenWeatherApiKey = async (e) => {
    e.preventDefault();
    try {
        console.log('handleUpdateOpenWeatherApiKey')
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADMIN_URL}/update-open-weather-api-key`,
        { token: apiKey }
      );

      setApiResponseMessage(
        response.message || "OpenWeather API Key updated successfully"
      );
    } catch (error) {
      console.error("Error updating API key:", error);
      setApiResponseMessage("Failed to update API key");
    }
  };

  const handleUpdateTelegramBotToken = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_ADMIN_URL}/update-telegram-bot-token`,
            { token: botToken }
          );

      setBotTokenResponseMessage(
        response.message || "Telegram Bot Token updated successfully"
      );
    } catch (error) {
      console.error("Error updating bot token:", error);
      setBotTokenResponseMessage("Failed to update bot token");
    }
  };

  return (
    <div
      className=""
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        backgroundImage: 'url("/images/background.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="d-flex justify-content-between align-items-center  ">
        <div className="d-flex justify-content-between align-items-center  w-100 m-4">
          <h1 className="text-center">Bot Settings</h1>
          <div>
            <button
              className="btn btn-primary mx-2"
              onClick={() => {
                navigate("/users");
              }}
            >
              Manage-Users
            </button>
            <button onClick={logoutHandler} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </div>
      <form onSubmit={handleUpdateTelegramBotToken}>
        <div className="form-group col-md-6 mx-auto">
          <label htmlFor="botToken">Telegram Bot Token</label>
          <input
            type="text"
            className="form-control"
            id="botToken"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="Enter Telegram Bot Token"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-4">
            Update Bot Token
          </button>
        </div>
      </form>
      {botTokenResponseMessage && (
        <p className="mt-4 alert alert-info text-center">
          {botTokenResponseMessage}
        </p>
      )}
      <form onSubmit={handleUpdateOpenWeatherApiKey} className="mt-5">
        <div className="form-group col-md-6 mx-auto">
          <label htmlFor="apiKey">OpenWeather API Key</label>
          <input
            type="text"
            className="form-control"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter OpenWeather API Key"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-4">
            Update API Key
          </button>
        </div>
      </form>
      {apiResponseMessage && (
        <p className="mt-4 alert alert-info text-center">
          {apiResponseMessage}
        </p>
      )}
    </div>
  );
}

export default Settings;
