import Web3 from "web3";
export function verifyEVMMessageSignature(
  taskId: string,
  schema: string,
  uHash: string,
  publicFieldsHash: string,
  signature: string,
  originAddress: string,
  recipient?: string
) {
  const web3 = new Web3();

  const types = ["bytes32", "bytes32", "bytes32", "bytes32"];
  const values = [
    Web3.utils.stringToHex(taskId),
    Web3.utils.stringToHex(schema),
    uHash,
    publicFieldsHash,
  ];

  if (recipient) {
    types.push("address");
    values.push(recipient);
  }

  const encodeParams = web3.eth.abi.encodeParameters(types, values);

  const paramsHash = Web3.utils.soliditySha3(encodeParams) as string;

  const nodeAddress = web3.eth.accounts.recover(paramsHash, signature);
  return nodeAddress === originAddress;
}
