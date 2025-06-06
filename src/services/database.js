const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

export const getAllBets = async () => {
  try {
    const response = await fetch(`${ENDPOINT_URL}/bet/all-bets`);

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

    // Directly parse the array from the respon se
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

// export const logClientAccess = async () => {
//   const ip = await fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => data.ip);
//   const userAgent = navigator.userAgent;
//   const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format timestamp
//   const url = window.location.href;
//   const referrer = document.referrer;

//   const logData = { ip, userAgent, timestamp, url, referrer };

//   try {
//     await fetch(`${import.meta.env.VITE_ENDPOINT_URL}/log/client-access`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(logData),
//     });
//   } catch (error) {
//     console.error("Error logging client access:", error);
//   }
// };