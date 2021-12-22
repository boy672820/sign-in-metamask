import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import mockData from '../utils/mock-data';
import mock from './mock';
import { publicAddress } from '../utils/mock-data/publicAddress';

const getUser = (address: string) => {
  const index = publicAddress.indexOf(address);
  const userPublicAddress = mockData.publicAddress(index);

  if (!userPublicAddress) {
    console.log('사용자가 존재하지 않습니다.');
    throw new Error('사용자가 존재하지 않습니다.');
  }

  const user = {
    id: mockData.id(index),
    publicAddress: userPublicAddress,
    nonce: mockData.nonce(index),
  };

  return user;
};

mock.onGet('/api/user').reply((config) => {
  const { params } = config;

  try {
    const user = getUser(params.publicAddress);

    return [200, user];
  } catch (e) {
    return [400, e];
  }
});

mock.onPost('/api/user/auth').reply((config) => {
  const data = JSON.parse(config.data);

  try {
    const user = getUser(data.publicAddress);

    const hex = bufferToHex(Buffer.from(user.nonce, 'utf8'));
    const address = recoverPersonalSignature({
      data: hex,
      sig: data.signature,
    });

    if (address.toLowerCase() === data.publicAddress.toLowerCase()) {
      return [200, user];
    } else {
      return [401, '인증에 실패하였습니다.'];
    }
  } catch (e: any) {
    return [400, e];
  }
});
