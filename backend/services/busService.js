import axios from "axios";

const API_URL = "http://localhost:5000/api/buses"; // Modify this to your backend API URL

const getBuses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    return [];
  }
};

export default { getBuses };
