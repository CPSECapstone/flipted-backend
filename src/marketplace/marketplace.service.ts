import { uid } from "uid/secure";
import { MARKETPLACE_TABLE } from "../environment";
import dynamodb from "../services/dynamodb";
import { createListingItem } from "./marketplace.helper";
import { ListingPK, ListingSK, marketListingPrefix } from "./marketplace.interface";

export async function addMarketListing(course: string, listing: MarketListingInput) {
   const item = createListingItem(uid(), new Date(), course, listing);
   const params: PutCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      item: item
   };
   try {
      dynamodb.putComposite(params);
      return item;
   } catch (err) {
      return err;
   }
}

export async function getMarketListings(course: string): Promise<MarketListing[]> {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      keyConditionExpression: "PK = :courseVal and begins_with(SK, :skPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ListingPK(course),
         ":skPrefix": marketListingPrefix
      }
   };

   return dynamodb.queryList<MarketListing>(params);
}

export async function removeMarketListing(course: string, listingId: string) {
   const params: DeleteParam = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(course),
         SK: ListingSK(listingId)
      }
   };

   try {
      await dynamodb.deleteItem(params);
      return "success";
   } catch (err) {
      throw err;
   }
}
