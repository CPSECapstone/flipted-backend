import { FROM_DB_DATE, TO_DB_DATE, TO_GRAPHQL_DATE } from "../environment";
import { createListingItem } from "./marketplace.helper";
import { ListingPK, ListingSK, MarketItem } from "./marketplace.interface";

describe("Creating a marketplace item", () => {
   it("Converts to a date string properly", async () => {
      expect(TO_DB_DATE(new Date(0))).toEqual("1970-01-01T00:00:00.000Z")
   }),

   it("Converts from a date string properly", async () => {
      expect(FROM_DB_DATE("1970-01-01T00:00:00.000Z")).toEqual(new Date(0))
   }),

   it("Converts to a graphql date string properly", async () => {
      expect(TO_GRAPHQL_DATE("1970-01-01T00:00:00.000Z")).toEqual(new Date(0))
   }),

   it("Converts the PK properly", async () => {
      expect(ListingPK("test")).toEqual("COURSE#test")
   }),

   it("Converts the SK properly", async () => {
      expect(ListingSK("id123")).toEqual("LISTING#id123")
   })

   it("Should do so from a graphql input type", async () => {
     
      const listingInput: MarketListingInput = {
         name: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5,
         stock: 10         
      }

      const uid = "abc123"
      const course = "Candy"
      const date = new Date(0)

      const expectedRes: MarketItem = {
         PK: ListingPK(course),
         SK: ListingSK(uid),
         id: uid,
         name: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5,
         stock: 10,
         timesPurchased: 0,
         listedDate: TO_DB_DATE(date),
         course: "Candy"
      }
      expect(createListingItem(uid, date, course, listingInput)).toEqual(expectedRes)
   });
});