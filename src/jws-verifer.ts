export {};

const {
   verifierFactory,
   errors: { JwtVerificationError, JwksNoMatchingKeyError }
} = require("@southlane/cognito-jwt-verifier");

// get a verifier instance. Put your config values here.
const verifier = verifierFactory({
   region: "us-west-1",
   userPoolId: "us-west-1_0AwmhkLS2",
   appClientId: "2fnf7vv8cofh8364p071gku4jn",
   tokenType: "access" // either "access" or "id"
});

export const validateToken = async (token: String) => {
   try {
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
