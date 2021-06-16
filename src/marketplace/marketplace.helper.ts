import { uid } from "uid";
import { TO_DB_DATE } from "../environment";
import { ListingPK, ListingSK, MarketItem, ReceiptD_SK, ReceiptInput, ReceiptItem, ReceiptMI_PK, ReceiptPK, ReceiptSK, ReceiptU_D_SK } from "./marketplace.interface";

export function createListingItem(uid: string, date: Date, course: string, listing: MarketListingInput) : MarketItem {
   return {
      PK: ListingPK(course),
      SK: ListingSK(uid),
      id: uid,
      listingName: listing.listingName,
      description: listing.description,
      image: listing.image,
      price: listing.price < 0 ? 0 : listing.price,
      stock: listing.stock?? undefined,
      timesPurchased: 0,
      listedDate: TO_DB_DATE(date),
      course: course
   }
}

export function createReceiptItem(input: ReceiptInput) : ReceiptItem {
   const receiptId = uid()
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
      fulfilled: false
   }
}