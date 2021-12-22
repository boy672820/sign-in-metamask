import { publicAddress } from './publicAddress';
import { nonce } from './nonce';

const mockData = {
  id: (index: number) => index + 1,
  publicAddress: (index: number) => publicAddress[index],
  nonce: (index: number) => nonce[index],
};

export default mockData;
