import { uid } from "uid/secure";
import { COURSE_CONTENT_TABLE_NAME, MARKETPLACE_TABLE } from "../environment";
import { StudentPK, StudentSK } from "../roster/rosterInterface";
import { getStudent } from "../roster/rosterService";
import dynamodb from "../services/dynamodb";
import { createListingItem } from "./marketplace.helper";
import {
   ListingPK,
   ListingSK,
   MarketItem,
   marketListingPrefix,
   StudentPointValues
} from "./marketplace.interface";

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

export async function editMarketListing(
   course: string,
   listingId: string,
   listing: MarketListingInput
): Promise<MarketListing> {
   let updateExpression =
      "set listingName = :listingName, description = :description, image = :image, price = :price";
   let expAttrValues: any = {
      ":listingName": listing.listingName,
      ":description": listing.description,
      ":image": listing.image,
      ":price": listing.price
   };

   if (listing.stock != undefined) {
      updateExpression += ", stock = :stock";
      expAttrValues = {
         ":stock": listing.stock,
         ...expAttrValues
      };
   } else {
      updateExpression += " remove stock";
   }

   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(course),
         SK: ListingSK(listingId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression: updateExpression,
      expressionAttributeValues: expAttrValues
   };

   return dynamodb.updateMarshall<MarketListing>(params);
}

export async function getMarketListing(course: string, listingId: string): Promise<MarketItem> {
   const params: GetCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(course),
         SK: ListingSK(listingId)
      }
   };

   return dynamodb.getCompositeDemarshall<MarketItem>(params)
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

// This will simply set the points of the student
// Use when we already know how many points the student had before calling
export async function setStudentPoints(
   course: string,
   userId: string,
   values: StudentPointValues
): Promise<{ points: number; totalPointsAwarded: number; totalPointsSpent: number }> {
   const params: UpdateParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: StudentPK(userId),
         SK: StudentSK(course)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set points = :points, totalPointsAwarded = :totalPointsAwarded, totalPointsSpent = :totalPointsSpent",
      expressionAttributeValues: {
         ":points": values.points,
         ":totalPointsAwarded": values.totalPointsAwarded,
         ":totalPointsSpent": values.totalPointsSpent
      }
   };

   const ret = await dynamodb.update(params);
   return values;
}

export async function addStudentPoints(course: string, userId: string, pointDelta: number) {
   const student = await getStudent(course, userId);
   const newPointValues: StudentPointValues = {
      points: pointDelta + student.points,
      totalPointsAwarded: pointDelta + student.totalPointsAwarded,
      totalPointsSpent: student.totalPointsSpent
   };
   return await setStudentPoints(course, userId, newPointValues);
}

// Updates values such as times purchased and stock
export async function updateMarketListingStats(courseId: string, listingId: string, quantity: number) : Promise<MarketItem> {
   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(courseId),
         SK: ListingSK(listingId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set timesPurchased = timesPurchased + :quantity", // Update stock after I make it non nullable
      expressionAttributeValues: {
         ":quantity": 2,
      }
   };

   return await dynamodb.updateMarshall<MarketItem>(params)
}

export async function executePurchase(
   course: string,
   listingId: string,
   userId: string,
   quantity: number
): Promise<Omit<Receipt, "student" | "listing">> {
   const listingItem = await getMarketListing(course, listingId)

   // make purchase and if successful: 
   updateMarketListingStats(course, listingId, quantity)
   return { pointsSpent: 3 } as unknown as Promise<Receipt>;
}
