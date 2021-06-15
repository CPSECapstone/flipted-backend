import { uid } from "uid/secure";
import { MARKETPLACE_TABLE } from "../environment";
import dynamodb from "../services/dynamodb";
import { createListingItem } from "./marketplace.helper";

export async function addMarketListing(course: string, listing: MarketListingInput) {
   const item = createListingItem(uid(), new Date(), course, listing);
   const params: PutCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      item: item
   };
   try {
      dynamodb.putComposite(params);
      return item
   } catch (err) {
      return err;
   }
}
