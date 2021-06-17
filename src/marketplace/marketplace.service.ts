import { uid } from "uid/secure";
import { COURSE_CONTENT_TABLE_NAME, MARKETPLACE_TABLE } from "../environment";
import { StudentPK, StudentSK } from "../roster/rosterInterface";
import { getStudent } from "../roster/rosterService";
import dynamodb from "../services/dynamodb";
import { createListingItem, createReceiptItem } from "./marketplace.helper";
import {
   COURSE_DATE_INDEX,
   COURSE_DATE_STUDENT_INDEX,
   ListingPK,
   ListingSK,
   MarketItem,
   marketListingPrefix,
   PointChange,
   purchaseDatePrefix,
   ReceiptD_SK,
   ReceiptInput,
   ReceiptItem,
   ReceiptPK,
   ReceiptSK,
   StudentPointValues,
   userPrefix
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

   return dynamodb.getCompositeDemarshall<MarketItem>(params);
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
): Promise<PointChange> {
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

export async function addStudentPoints(course: string, userId: string, pointChange: PointChange) {
   const params: UpdateParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: StudentPK(userId),
         SK: StudentSK(course)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set points = points + :points, totalPointsAwarded = totalPointsAwarded + :totalPointsAwarded, totalPointsSpent = totalPointsSpent + :totalPointsSpent",
      expressionAttributeValues: {
         ":points": pointChange.points,
         ":totalPointsAwarded": pointChange.totalPointsAwarded,
         ":totalPointsSpent": pointChange.totalPointsSpent
      }
   };

   return await dynamodb.updateMarshall<PointChange>(params);
}

// Updates values such as times purchased and stock
export async function updateMarketListingStats(
   courseId: string,
   listingId: string,
   quantity: number
): Promise<MarketItem> {
   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(courseId),
         SK: ListingSK(listingId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression: "set timesPurchased = timesPurchased + :quantity", // Update stock after I make it non nullable
      expressionAttributeValues: {
         ":quantity": quantity
      }
   };

   return await dynamodb.updateMarshall<MarketItem>(params);
}

export async function fulfillPurchase(course: string, receiptId: string, fulfilled: boolean) {
   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ReceiptPK(course),
         SK: ReceiptSK(receiptId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set fulfilled = :fulfilled",
      expressionAttributeValues: {
         ":fulfilled": fulfilled,
      }
   };

   return await dynamodb.updateMarshall<ReceiptItem>(params);
}

export async function executePurchase(
   course: string,
   listingId: string,
   userId: string,
   quantity: number,
   note: string
): Promise<Omit<Receipt, "student" | "listing" | "purchaseDate">> {
   const [listingItem, student] = await Promise.all([
      getMarketListing(course, listingId),
      getStudent(course, userId)
   ]);
   const totalCost = listingItem.price * quantity;

   // TODO: AND stock > quantity after stock is not nullable
   if (totalCost <= student.points) {
      updateMarketListingStats(course, listingId, quantity);

      // TODO: update total points awarded and total points spent for student
      const pointChange : PointChange = {
         points: -totalCost,
         totalPointsAwarded: 0,
         totalPointsSpent: totalCost
      }
      await addStudentPoints(course, userId, pointChange);

      const receiptInput: ReceiptInput = {
         date: new Date(),
         note: note,
         quantity: quantity,
         studentId: userId,
         listingId: listingItem.id,
         listingName: listingItem.listingName,
         price: listingItem.price,
         course: course
      };

      const item = createReceiptItem(receiptInput);
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

   throw new Error(
      `Insufficient funds: Required: ${totalCost}, User ${userId} point balance: ${student.points}`
   );
}

export function recentClassPurchases(course: string, fetch: number) {
   const params : QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": purchaseDatePrefix
      }
   }

   return dynamodb.queryList<Receipt>(params);
}

export function recentStudentPurchases(course: string, studentId: string, fetch: number) {
   const params : QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_STUDENT_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(U_D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": `${userPrefix}${studentId}#${purchaseDatePrefix}`
      }
   }

   return dynamodb.queryList<Receipt>(params);
}

