import { uid } from "uid";
import { string } from "yargs";
import { TO_DB_DATE } from "../environment";
import {
   ActivityD_SK,
   ActivityPK,
   ActivitySK,
   ActivityU_D_SK,
   ListingPK,
   ListingSK,
   MarketItem,
   ReceiptD_SK,
   ReceiptInput,
   ReceiptItem,
   ReceiptMI_PK,
   ReceiptPK,
   ReceiptSK,
   ReceiptU_D_SK,
   unfulfilledPrefix
} from "./marketplace.interface";

export function createListingItem(
   uid: string,
   date: Date,
   course: string,
   listing: MarketListingInput
): MarketItem {
   return {
      PK: ListingPK(course),
      SK: ListingSK(uid),
      id: uid,
      listingName: listing.listingName,
      description: listing.description,
      image: listing.image,
      price: listing.price < 0 ? 0 : listing.price,
      stock: listing.stock ?? null,
      timesPurchased: 0,
      listedDate: TO_DB_DATE(date),
      course: course,
      deleted: false
   };
}

export function createReceiptItem(input: ReceiptInput): ReceiptItem {
   const receiptId = uid();
   return {
      PK: ReceiptPK(input.course),
      SK: ReceiptSK(receiptId),
      D_SK: ReceiptD_SK(input.date),
      U_D_SK: ReceiptU_D_SK(input.studentId, input.date),
      MI_PK: ReceiptMI_PK(input.listingId),
      receiptId: receiptId,
      note: input.note,
      purchaseDate: TO_DB_DATE(input.date),
      pointsSpent: input.quantity * input.price,
      quantity: input.quantity,
      studentId: input.studentId,
      course: input.course,
      listingName: input.listingName,
      listingId: input.listingId,
      fulfilled: false,
      UF_SK: unfulfilledPrefix
   };
}

export function createActivityItem(
   course: string,
   studentId: string,
   note: string,
   pointChange: number,
   date: Date
) {
   const activityId = uid();
   return {
      PK: ActivityPK(course),
      SK: ActivitySK(activityId),
      D_SK: ActivityD_SK(date),
      U_D_SK: ActivityU_D_SK(studentId, date),
      activityId: activityId,
      note: note,
      pointChange,
      activityDate: TO_DB_DATE(date),
      studentId: studentId,
      course: course
   };
}
