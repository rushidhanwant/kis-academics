import axios from "axios";

const client = () => {
    const defaultOptions = {
      baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    // Create instance
    const instance = axios.create(defaultOptions);
  
  
    return instance;
  };
  
  export default client();
  