import { TO_DB_DATE } from "../environment";

export type MarketItem = CompositeDBItem & {
   id: string;
   listingName: string;
   description: string;
   image: string;
   course: string;
   listedDate: string;
   price: number;
   stock: number | null;
   timesPurchased: number;
   deleted: boolean;
};

export type ReceiptItem = CompositeDBItem & {
   MI_PK: string; // LISTING# listingID
   D_SK: string; // PURCHASE_DATE# purchase date
   U_D_SK: string; // USER# userid #PURCHASE_DATE# purchase date
   UF_SK?: string; // exists only on unfulfilled purchases. removed on fulfillment.
   studentId: string;
   listingId: string;
   receiptId: string;
   course: string;
   note: string;
   purchaseDate: string;
   pointsSpent: number;
   quantity: number;
   listingName: string;
   fulfilled: boolean;
};

export type ReceiptInput = {
   date: Date;
   note: string;
   quantity: number;
   studentId: string;
   course: string;
   listingId: string;
   price: number;
   listingName: string;
};

export type PointChange = {
   points: number;
   totalPointsAwarded: number;
   totalPointsSpent: number;
};

export const COURSE_DATE_INDEX = "PK-D_SK-index";
export const COURSE_DATE_STUDENT_INDEX = "PK-U_D_SK-index";
export const UNFULFILLED_INDEX = "PK-UF_SK-index";
export const userPrefix = "USER#";
export const coursePrefix = "COURSE#";
export const receiptPrefix = "RECEIPT#";
export const activityPrefix = "ACTIVITY#";
export const marketListingPrefix = "LISTING#";
export const purchaseDatePrefix = "PURCHASE_DATE#";
export const activityDatePrefix = "ACTIVITY_DATE#";
export const unfulfilledPrefix = "X";

export function ListingPK(course: string): string {
   return `${coursePrefix}${course}`;
}

export function ListingSK(listingId: string): string {
   return `${marketListingPrefix}${listingId}`;
}

export function ReceiptPK(course: string): string {
   return `${coursePrefix}${course}`;
}

export function ReceiptSK(receiptId: string): string {
   return `${receiptPrefix}${receiptId}`;
}

export function ReceiptMI_PK(listingId: string): string {
   return `${marketListingPrefix}${listingId}`;
}

export function ReceiptD_SK(date: Date): string {
   return `${purchaseDatePrefix}${TO_DB_DATE(date)}`;
}

export function ReceiptU_D_SK(user: string, date: Date): string {
   return `${userPrefix}${user}#${purchaseDatePrefix}${TO_DB_DATE(date)}`;
}

export interface StudentPointValues {
   points: number;
   totalPointsAwarded: number;
   totalPointsSpent: number;
}

export function ActivityPK(course: string): string {
   return `${coursePrefix}${course}`;
}

export function ActivitySK(activityId: string): string {
   return `${activityPrefix}${activityId}`;
}

export function ActivityD_SK(date: Date): string {
   return `${activityDatePrefix}${TO_DB_DATE(date)}`;
}

export function ActivityU_D_SK(user: string, date: Date): string {
   return `${userPrefix}${user}#${activityDatePrefix}${TO_DB_DATE(date)}`;
}
