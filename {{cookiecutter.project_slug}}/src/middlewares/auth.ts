// express
import { Response, NextFunction } from 'express';

// jsonwebtoken
import { verify } from 'jsonwebtoken';

// signing service
import jwksRsa, { SigningKey } from 'jwks-rsa';

// environment variables
import { env } from '@/variables';

// types
import { ExtendedRequest } from '@/types';

// middleware for the authorization
const authCheck = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: 'Authorization header is missing' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  const jwksClient = jwksRsa({
    jwksUri: `${env.OKTA_ISSUER_URL}/v1/keys`,
  });

  function getKey(
    header: { kid?: string | undefined },
    callback: (error: Error | null, signingKey?: string) => void,
  ) {
    jwksClient.getSigningKey(header.kid || '', (err: Error | null, key: SigningKey | undefined) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  verify(
    token,
    getKey as any, // Type assertion since `verify` has limited typing for the `getKey` function
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Token verification failed', error: err.message });
      }

      // Attach decoded token to request object
      req.user = decoded;
      next();
    },
  );
};

export default authCheck;
