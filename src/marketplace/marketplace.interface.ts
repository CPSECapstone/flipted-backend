export type MarketItem = CompositeDBItem & {
   id: string;
   name: string;
   description: string;
   image: string;
   course: string;
   listedDate: string;
   price: number;
   stock?: number;
   timesPurchased: number;
};

export const coursePrefix = "COURSE#";
export const marketListingPrefix = "LISTING#";

export function ListingPK(course: string): string {
   return `${coursePrefix}${course}`;
}

export function ListingSK(listingId: string): string {
   return `${marketListingPrefix}${listingId}`;
}

export interface StudentPointValues {
   points: number;
   totalPointsAwarded: number;
   totalPointsSpent: number;
}
