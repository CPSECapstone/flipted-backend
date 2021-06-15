import dynamodbMock from "../../test/__mocks__/dynamodb";
import { FROM_DB_DATE, MARKETPLACE_TABLE, TO_DB_DATE, TO_GRAPHQL_DATE } from "../environment";
import { createListingItem } from "./marketplace.helper";
import { ListingPK, ListingSK, MarketItem, marketListingPrefix } from "./marketplace.interface";
import * as marketService from "./marketplace.service";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("Converting to keys and datestrings", () => {
   it("Converts to a date string properly", async () => {
      expect(TO_DB_DATE(new Date(0))).toEqual("1970-01-01T00:00:00.000Z");
   }),
      it("Converts from a date string properly", async () => {
         expect(FROM_DB_DATE("1970-01-01T00:00:00.000Z")).toEqual(new Date(0));
      }),
      it("Converts to a graphql date string properly", async () => {
         expect(TO_GRAPHQL_DATE("1970-01-01T00:00:00.000Z")).toEqual(new Date(0));
      }),
      it("Converts the PK properly", async () => {
         expect(ListingPK("test")).toEqual("COURSE#test");
      }),
      it("Converts the SK properly", async () => {
         expect(ListingSK("id123")).toEqual("LISTING#id123");
      });
});

describe("Deleting a marketplace item", () => {
   it("Calls deleteItem with the correct params", async () => {
      const expectedParamArgs: DeleteParam = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("course"),
            SK: ListingSK("123")
         }
      };

      const res = await marketService.removeMarketListing("course", "123");
      expect(res).toEqual("success");
      expect(dynamodbMock.deleteItem).toHaveBeenCalledWith(expectedParamArgs);
      expect(dynamodbMock.deleteItem).toHaveBeenCalledTimes(1);
   });
});

describe("Viewing marketplace items", () => {
   it("Queries the items with the correct params", async () => {
      const course = "testcourse"

      const expectedParamArgs: QueryParams = {
         tableName: MARKETPLACE_TABLE,
         keyConditionExpression: "PK = :courseVal and begins_with(SK, :skPrefix) ",
         expressionAttributeValues: {
            ":courseVal": ListingPK(course),
            ":skPrefix": marketListingPrefix
         }
      };

      const res = await marketService.getMarketListings(course);
      expect(dynamodbMock.queryList).toHaveBeenCalledWith(expectedParamArgs);
      expect(dynamodbMock.queryList).toHaveBeenCalledTimes(1);
   });
});

describe("Creating a marketplace item", () => {
   it("Should do so from a graphql input type", async () => {
      const listingInput: MarketListingInput = {
         name: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5,
         stock: 10
      };

      const uid = "abc123";
      const course = "Candy";
      const date = new Date(0);

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
      };
      expect(createListingItem(uid, date, course, listingInput)).toEqual(expectedRes);
   });
});
