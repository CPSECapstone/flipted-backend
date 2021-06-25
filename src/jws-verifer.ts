export {};

const {
   verifierFactory,
   errors: { JwtVerificationError, JwksNoMatchingKeyError }
} = require("@southlane/cognito-jwt-verifier");

// get a verifier instance. Put your config values here.
const verifier = verifierFactory({
   region: "us-east-1",
   userPoolId: "us-east-1_POfbbYTKF",
   appClientId: "24sdf1brebo58s89ja0b63c51d",
   tokenType: "access" // either "access" or "id"
});

export const validateToken = async (token: String) => {
   try {
      return {
         username: "0eac70aa-48d5-40db-a6e7-635ce502b7b2"
      }
      const tokenPayload = await verifier.verify(token);
      return tokenPayload;
   } catch (e) {
      if (e instanceof JwtVerificationError || e instanceof JwksNoMatchingKeyError) {
         // token is malformed, invalid, expired or cannot be validated with known keys
         // act accordingly, e.g. return HTTP 401 error
      }

      throw e;
   }
};
