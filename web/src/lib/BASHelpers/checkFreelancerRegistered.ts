import axios from "axios";

export const checkFreelancerRegistered = async (freelancerAddress: string) => {
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancer/${freelancerAddress}`
    );
    console.log(data.data);
    if (data.data) {
      return true;
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
