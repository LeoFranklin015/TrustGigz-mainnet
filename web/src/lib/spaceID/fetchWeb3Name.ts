export const FetchWeb3Name = async (web3name: any, address: any) => {
  if (address) {
    try {
      const webName = await web3name.getDomainName({
        address: address,
        queryChainIdList: [1],
      });
      console.log("Fetched Web3 Name:", webName);
      if (webName) {
        return webName;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching Web3 name:", error);
    }
  }
};
