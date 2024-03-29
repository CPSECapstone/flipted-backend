declare module "*.graphql" {
   import { DocumentNode } from "graphql";
   const Schema: DocumentNode;

   export = Schema;
}

declare module "*.json" {
   const value: any;
   export default value;
}
