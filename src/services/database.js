const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

export const getAllBets = async () => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/api/bets`);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Directly parse the array from the response
      const data = await response.json();
      // console.log("Fetched bets:", data); // Log to debug
      return data; // Directly return the array
    } catch (error) {
      console.error("Error fetching bets:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  export const getLeaderboardBets = async () => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/bet/leaderboard-bets`);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Directly parse the array from the response
      const data = await response.json();
      // console.log("Fetched bets:", data); // Log to debug
      return data; // Directly return the array
    } catch (error) {
      console.error("Error fetching bets:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  export const getLeaderboardBettors = async () => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/bet/leaderboard-bettors`);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Directly parse the array from the response
      const data = await response.json();
      // console.log("Fetched bets:", data); // Log to debug
      return data; // Directly return the array
    } catch (error) {
      console.error("Error fetching bets:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  export const getLeaderboardAcceptors = async () => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/bet/leaderboard-acceptors`);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Directly parse the array from the response
      const data = await response.json();
      // console.log("Fetched bets:", data); // Log to debug
      return data; // Directly return the array
    } catch (error) {
      console.error("Error fetching bets:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  };