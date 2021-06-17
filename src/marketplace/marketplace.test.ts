import { UpdateItemInput } from "@aws-sdk/client-dynamodb";
import { mocked } from "ts-jest/utils";
import { uid } from "uid";
import dynamodbMock from "../../test/__mocks__/dynamodb";
import {
   COURSE_CONTENT_TABLE_NAME,
   FROM_DB_DATE,
   MARKETPLACE_TABLE,
   TO_DB_DATE,
   TO_GRAPHQL_DATE
} from "../environment";
import { StudentPK, StudentSK } from "../roster/rosterInterface";
import { getStudent } from "../roster/rosterService";
import { createListingItem, createReceiptItem } from "./marketplace.helper";
import {
   ListingPK,
   ListingSK,
   MarketItem,
   marketListingPrefix,
   PointChange,
   ReceiptD_SK,
   ReceiptInput,
   ReceiptItem,
   ReceiptMI_PK,
   ReceiptPK,
   receiptPrefix,
   ReceiptSK,
   ReceiptU_D_SK,
   StudentPointValues
} from "./marketplace.interface";
import * as marketService from "./marketplace.service";
import { updateMarketListingStats } from "./marketplace.service";
import { executePurchase } from "./marketplace.service";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

jest.mock("../roster/rosterService", () => ({
   getStudent: jest.fn()
}));

jest.mock("uid", () => ({
   uid: jest.fn()
}));

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
      it("Converts the listing PK properly", async () => {
         expect(ListingPK("test")).toEqual("COURSE#test");
      }),
      it("Converts the listing SK properly", async () => {
         expect(ListingSK("id123")).toEqual("LISTING#id123");
      });
   it("Converts the receipt PK properly", async () => {
      expect(ReceiptPK("course")).toEqual("COURSE#course");
   });
   it("Converts the receipt SK properly", async () => {
      expect(ReceiptSK("receiptId")).toEqual("RECEIPT#receiptId");
   });
   it("Converts the receipt MI_PK properly", async () => {
      expect(ReceiptMI_PK("listingId")).toEqual("LISTING#listingId");
   });
   it("Converts the receipt D_SK properly", async () => {
      expect(ReceiptD_SK(new Date(0))).toEqual("PURCHASE_DATE#1970-01-01T00:00:00.000Z");
   });
   it("Converts the receipt U_D_SK properly", async () => {
      expect(ReceiptU_D_SK("userid", new Date(0))).toEqual(
         "USER#userid#PURCHASE_DATE#1970-01-01T00:00:00.000Z"
      );
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
   it("Gets a single item with the correct params", async () => {
      const params: GetCompositeParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseid"),
            SK: ListingSK("listingid")
         }
      };

      const res = await marketService.getMarketListing("courseid", "listingid");

      expect(dynamodbMock.getCompositeDemarshall).toHaveBeenCalledWith(params);
      expect(dynamodbMock.getCompositeDemarshall).toHaveBeenCalledTimes(1);
   });
   it("Queries the items with the correct params", async () => {
      const course = "testcourse";

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
         listingName: "Snickers Bar",
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
         listingName: "Snickers Bar",
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

describe("Editing a marketplace item", () => {
   it("Will include the stock attribute if the input is not null", async () => {
      const listingInput: MarketListingInput = {
         listingName: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5,
         stock: 10
      };

      const expectedParamArgs: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseId"),
            SK: ListingSK("listingId")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set listingName = :listingName, description = :description, image = :image, price = :price, stock = :stock",
         expressionAttributeValues: {
            ":listingName": "Snickers Bar",
            ":description": "One delicious Snickers bar.",
            ":image": "https://i.imgur.com/UHm9oTg.jpeg",
            ":price": 5,
            ":stock": 10
         }
      };
      marketService.editMarketListing("courseId", "listingId", listingInput);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.updateMarshall).toHaveBeenCalledTimes(1);
   });
   it("Will remove the stock attribute if the input is null", async () => {
      const listingInput: MarketListingInput = {
         listingName: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5
      };

      const expectedParamArgs: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseId"),
            SK: ListingSK("listingId")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set listingName = :listingName, description = :description, image = :image, price = :price remove stock",
         expressionAttributeValues: {
            ":listingName": "Snickers Bar",
            ":description": "One delicious Snickers bar.",
            ":image": "https://i.imgur.com/UHm9oTg.jpeg",
            ":price": 5
         }
      };
      marketService.editMarketListing("courseId", "listingId", listingInput);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.updateMarshall).toHaveBeenCalledTimes(2);
   });
});

describe("Changing a students points", () => {
   it("Should update the item with the correct params", async () => {
      const pointValues: StudentPointValues = {
         points: 1,
         totalPointsAwarded: 6,
         totalPointsSpent: 5
      };
      const expectedParamArgs: UpdateParams = {
         tableName: COURSE_CONTENT_TABLE_NAME,
         key: {
            PK: StudentPK("userid"),
            SK: StudentSK("courseId")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set points = :points, totalPointsAwarded = :totalPointsAwarded, totalPointsSpent = :totalPointsSpent",
         expressionAttributeValues: {
            ":points": pointValues.points,
            ":totalPointsAwarded": pointValues.totalPointsAwarded,
            ":totalPointsSpent": pointValues.totalPointsSpent
         }
      };

      expect(await marketService.setStudentPoints("courseId", "userid", pointValues)).toEqual({
         points: 1,
         totalPointsAwarded: 6,
         totalPointsSpent: 5
      });

      expect(dynamodbMock.update).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.update).toHaveBeenCalledTimes(1);
      expect(dynamodbMock.put).toHaveBeenCalledTimes(0);
      expect(dynamodbMock.get).toHaveBeenCalledTimes(0);
   });

   it("Should correctly add the points when modifying as a delta", async () => {
      (dynamodbMock.updateMarshall as jest.Mock).mockReturnValue({
         points: 8,
         totalPointsAwarded: 18,
         totalPointsSpent: 10
      });

      const pointChange: PointChange = {
         points: 3,
         totalPointsAwarded: 3,
         totalPointsSpent: 0
      }

      const params: UpdateParams = {
         tableName: COURSE_CONTENT_TABLE_NAME,
         key: {
            PK: StudentPK("testId"),
            SK: StudentSK("testCourse")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set points = points + :points, totalPointsAwarded = totalPointsAwarded + :totalPointsAwarded, totalPointsSpent = totalPointsSpent + :totalPointsSpent",
         expressionAttributeValues: {
            ":points": 3,
            ":totalPointsAwarded": 3,
            ":totalPointsSpent": 0
         }
      };

      expect(await marketService.addStudentPoints("testCourse", "testId", pointChange)).toEqual({
         points: 8,
         totalPointsAwarded: 18,
         totalPointsSpent: 10
      });

      expect(dynamodbMock.updateMarshall).toBeCalledWith(params)
   });
});

describe("Creating a receipt", () => {
   test("Creating dynamo db item", async () => {
      mocked(uid).mockReturnValue("receiptid");

      const date = new Date(0);
   
      const receiptInput: ReceiptInput = {
         date: date,
         note: "With extra sprinkles!",
         quantity: 2,
         studentId: "userid",
         course: "courseid",
         price: 3,
         listingId: "cupcakeid",
         listingName: "Chocolate Cupcake"
      };

      const expectedRes: ReceiptItem = {
         PK: ReceiptPK("courseid"),
         SK: ReceiptSK("receiptid"),
         D_SK: ReceiptD_SK(date),
         U_D_SK: ReceiptU_D_SK("userid", date),
         MI_PK: ReceiptMI_PK("cupcakeid"),
         note: "With extra sprinkles!",
         purchaseDate: "1970-01-01T00:00:00.000Z",
         pointsSpent: 6,
         quantity: 2,
         studentId: "userid",
         receiptId: "receiptid",
         course: "courseid",
         listingName: "Chocolate Cupcake",
         listingId: "cupcakeid",
         fulfilled: false
      };
      expect(createReceiptItem(receiptInput)).toEqual(expectedRes);
      expect(uid).toBeCalledTimes(1);
   });

   test;
});

describe("Making a purchase", () => {
   test("Updating the marketplace listing stats with a stockless item", async () => {
      dynamodbMock.updateMarshall.mockClear()

      const expectedParamArgs: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseid"),
            SK: ListingSK("cupcakeid")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set timesPurchased = timesPurchased + :quantity",
         expressionAttributeValues: {
            ":quantity": 2,
         }
      };
      marketService.updateMarketListingStats("courseid", "cupcakeid", 2)
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs)
      expect(dynamodbMock.updateMarshall).toBeCalledTimes(1)
   });

   test("Creates a graphql receipt on purchase", async () => {
      jest.spyOn(marketService, 'updateMarketListingStats')
      const plswork = jest.spyOn(marketService, 'getMarketListing')


      const date = new Date(0);
      const expectedRes: Omit<Receipt, "student" | "listing"> = {
         note: "With extra sprinkles!",
         purchaseDate: date,
         pointsSpent: 6,
         quantity: 2,
         studentId: "userid",
         receiptId: "receiptid",
         course: "courseid",
         listingId: "cupcakeid",
         fulfilled: false
      };
      //await executePurchase("courseid", "listingid", "userid", 2, "thanks!")
   });

   test;
});
