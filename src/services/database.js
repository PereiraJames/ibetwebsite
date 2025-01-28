export const getAllBets = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bets`);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Directly parse the array from the response
      const data = await response.json();
      console.log("Fetched bets:", data); // Log to debug
      return data; // Directly return the array
    } catch (error) {
      console.error("Error fetching bets:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  