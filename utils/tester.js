import {
    decode as nextDecode,
    encode as nextEncode,
  } from 'next-auth/jwt';
  
  const secret = process.env.NEXTAUTH_SECRET;

  /**
   * Decodes Next Auth encoded token
   * @param token Encoded token
   * @returns Decoded token
   */
  const jwtDecode = async (token) => {
    const decoded = await nextDecode({
      token,
      secret,
    });
  
    return decoded;
  };
  
  /**
   * Encodes Next Auth decoded token
   * @param token Decoded token
   * @returns Encoded token
   */
  const jwtEncode = async (token) => {
    const encoded = await nextEncode({
      token,
      secret,
    });
  
    return encoded;
  };
  
  const tester = {
    jwtDecode,
    jwtEncode,
  };
  
  export default tester;
  