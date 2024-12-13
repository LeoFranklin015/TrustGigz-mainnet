import axios from "axios";

export const checkClientRegistered = async (clientAddress: string) => {
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/${clientAddress}`
    );
    console.log(data.data);
    if (data.data) {
      return data.data;
    } else {
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};
