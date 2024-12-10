import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { clientSchema } from "../const";
import { useEthersSigner } from "../viemClient";
import { bscTestnet } from "viem/chains";

export const getAttestationDataFromUID = async (
  schemaUid: string,
  type: string
) => {
  const BASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //bnb testnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bscTestnet.id });
  if (type === "client") {
    const schemaEncoder = new SchemaEncoder(clientSchema);
    bas.connect(signer!);
    const attestation = await bas.getAttestation(schemaUid);
    const data = schemaEncoder.decodeData(attestation.data);
    return data;
  }
};
