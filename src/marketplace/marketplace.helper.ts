import { uid } from "uid";
import { TO_DB_DATE } from "../environment";
import { ListingPK, ListingSK, MarketItem } from "./marketplace.interface";

export function createListingItem(uid: string, date: Date, course: string, listing: MarketListingInput) : MarketItem {
   return {
      PK: ListingPK(course),
      SK: ListingSK(uid),
      id: uid,
      name: listing.name,
      description: listing.description,
      image: listing.image,
      price: listing.price < 0 ? 0 : listing.price,
      stock: listing.stock?? undefined,
      timesPurchased: 0,
      listedDate: TO_DB_DATE(date),
      course: course
   }
}