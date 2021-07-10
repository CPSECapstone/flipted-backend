import { uid } from "uid/secure";
import { COURSE_CONTENT_TABLE_NAME, MARKETPLACE_TABLE } from "../environment";
import { StudentPK, StudentSK } from "../course/courseInterface";
import { getStudent } from "../course/courseService";
import dynamodb from "../services/dynamodb";
import { createActivityItem, createListingItem, createReceiptItem } from "./marketplace.helper";
import {
   activityDatePrefix,
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
   unfulfilledPrefix,
   UNFULFILLED_INDEX,
   userPrefix
} from "./marketplace.interface";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

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
      "set listingName = :listingName, description = :description, image = :image, price = :price, stock = :stock";
   let expAttrValues: any = {
      ":listingName": listing.listingName,
      ":description": listing.description,
      ":image": listing.image,
      ":price": listing.price,
      ":stock": listing.stock ?? null
   };

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
      filterExpression: "deleted = :deletedVal",
      expressionAttributeValues: {
         ":courseVal": ListingPK(course),
         ":skPrefix": marketListingPrefix,
         ":deletedVal": false
      }
   };

   return dynamodb.queryList<MarketListing>(params);
}

export async function removeMarketListing(course: string, listingId: string) {
   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(course),
         SK: ListingSK(listingId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression: "set deleted = :deleted",
      expressionAttributeValues: {
         ":deleted": true
      }
   };

   await dynamodb.updateMarshall<MarketItem>(params);
   return "success";
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
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: StudentPK(course),
         SK: StudentSK(userId)
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
   quantity: number,
   usesStock: boolean
): Promise<MarketItem> {
   let updateExpression = "set timesPurchased = timesPurchased + :quantity";
   if (usesStock) updateExpression += ", stock = stock - :quantity";

   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ListingPK(courseId),
         SK: ListingSK(listingId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression: updateExpression,
      expressionAttributeValues: {
         ":quantity": quantity
      }
   };

   return await dynamodb.updateMarshall<MarketItem>(params);
}

export async function fulfillPurchase(course: string, receiptId: string, fulfilled: boolean) {
   let updateExpression = "";
   let expAttrValues = {};
   if (fulfilled) {
      updateExpression = "set fulfilled = :fulfilled remove UF_SK";
      expAttrValues = {
         ":fulfilled": fulfilled
      };
   } else {
      updateExpression = "set fulfilled = :fulfilled, UF_SK = :unfulfilledPrefix";
      expAttrValues = {
         ":fulfilled": fulfilled,
         ":unfulfilledPrefix": unfulfilledPrefix
      };
   }

   const params: UpdateParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ReceiptPK(course),
         SK: ReceiptSK(receiptId)
      },
      conditionExpression: "attribute_exists(SK)",
      updateExpression: updateExpression,
      expressionAttributeValues: expAttrValues
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

   if (listingItem.stock !== null && listingItem.stock < quantity) {
      throw new Error(`Insufficient stock: Required: ${quantity}, Stock: ${listingItem.stock}`);
   }

   if (quantity <= 0) {
      throw new Error(`Insufficient quantity: Must purchase at least one item.`);
   }

   if (totalCost > student.points) {
      throw new Error(
         `Insufficient funds: Required: ${totalCost}, User ${userId} point balance: ${student.points}`
      );
   }

   // Eligible for purchase
   updateMarketListingStats(course, listingId, quantity, listingItem.stock !== null);

   const pointChange: PointChange = {
      points: -totalCost,
      totalPointsAwarded: 0,
      totalPointsSpent: totalCost
   };
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
      createActivity(course, userId, `Purchased ${listingItem.listingName}`, -totalCost);
      dynamodb.putComposite(params);
      return item;
   } catch (err) {
      return err;
   }
}

export function recentClassPurchases(course: string, fetch: number) {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": purchaseDatePrefix
      }
   };

   return dynamodb.queryList<Receipt>(params);
}

export function recentClassActivity(course: string, fetch: number) {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": activityDatePrefix
      }
   };

   return dynamodb.queryList<Activity>(params);
}

export function recentStudentPurchases(course: string, studentId: string, fetch: number) {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_STUDENT_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(U_D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": `${userPrefix}${studentId}#${purchaseDatePrefix}`
      }
   };

   return dynamodb.queryList<Receipt>(params);
}

export async function unfulfilledPurchases(course: string, user?: string) {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: UNFULFILLED_INDEX,
      keyConditionExpression: "PK = :courseVal and begins_with(UF_SK, :ufskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":ufskPrefix": unfulfilledPrefix
      }
   };

   const list = await dynamodb.queryList<Receipt>(params);

   if (user) {
      return list.filter(receipt => {
         return receipt.studentId == user;
      });
   }
   return list;
}

export async function getReceipt(courseId: string, receiptId: string) {
   const params: GetCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ReceiptPK(courseId),
         SK: ReceiptSK(receiptId)
      }
   };

   return dynamodb.getCompositeDemarshall<ReceiptItem>(params);
}

export async function deleteReceipt(courseId: string, recieptId: string) {
   const params: DeleteParam = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: ReceiptPK(courseId),
         SK: ReceiptSK(recieptId)
      }
   };

   return dynamodb.deleteItem(params);
}

export async function refundPurchase(course: string, receiptId: any) {
   const receipt = await getReceipt(course, receiptId);
   const listing = await getMarketListing(course, receipt.listingId);
   await updateMarketListingStats(course, listing.id, -receipt.quantity, listing.stock !== null);
   await deleteReceipt(course, receiptId);
   await addStudentPoints(course, receipt.studentId, {
      points: receipt.pointsSpent,
      totalPointsSpent: -receipt.pointsSpent,
      totalPointsAwarded: 0
   });

   createActivity(
      course,
      receipt.studentId,
      `Purchase of ${listing.listingName} refunded`,
      receipt.pointsSpent
   );
   return true;
}

export async function createActivity(
   course: string,
   studentId: string,
   note: string,
   pointChange: number
) {
   const item = createActivityItem(course, studentId, note, pointChange, new Date());
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

export function recentStudentActivity(course: string, studentId: string, fetch: number) {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: COURSE_DATE_STUDENT_INDEX,
      scanIndexForward: false,
      limit: fetch,
      keyConditionExpression: "PK = :courseVal and begins_with(U_D_SK, :dskPrefix) ",
      expressionAttributeValues: {
         ":courseVal": ReceiptPK(course),
         ":dskPrefix": `${userPrefix}${studentId}#${activityDatePrefix}`
      }
   };

   return dynamodb.queryList<Activity>(params);
}
