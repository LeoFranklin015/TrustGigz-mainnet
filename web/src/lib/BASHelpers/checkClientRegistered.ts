import axios from "axios";
import { clientSchemaUID } from "../const";
import { getAttestationDataFromUID } from "./getAttestationDataFromUID";

export const checkClientRegistered = async (clientAddress: string) => {
  const firstPage = 1;
  const pageSize = 10;
  const attestations = await axios.get(
    `/api/bas?schemaUid=${clientSchemaUID}&page=${firstPage}&pageSize=${pageSize}`
  );
  console.log(attestations.data.attestations);
  const fetchedAttestations = attestations.data.attestations;
  fetchedAttestations.forEach((attestation: any) => {
    if (clientAddress == attestation.owner) {
      return true;
    }
  });
  return false;
};

checkClientRegistered("0x4b4b30e2E7c6463b03CdFFD6c42329D357205334");
