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
import { StudentPK, StudentSK } from "../course/courseInterface";
import { getStudent } from "../course/courseService";
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
   ReceiptMI_PK,
   ReceiptPK,
   receiptPrefix,
   ReceiptSK,
   ReceiptU_D_SK,
   StudentPointValues,
   unfulfilledPrefix,
   UNFULFILLED_INDEX,
   userPrefix
} from "./marketplace.interface";
import * as marketService from "./marketplace.service";
import { updateMarketListingStats } from "./marketplace.service";
import { executePurchase } from "./marketplace.service";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

jest.mock("../course/courseService", () => ({
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
         filterExpression: "deleted = :deletedVal",
         expressionAttributeValues: {
            ":courseVal": ListingPK(course),
            ":skPrefix": marketListingPrefix,
            ":deletedVal": false
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
         course: "Candy",
         deleted: false
      };
      expect(createListingItem(uid, date, course, listingInput)).toEqual(expectedRes);
   });
});

describe("Editing a marketplace item", () => {
   it("Will do so with the correct update expression", async () => {
      dynamodbMock.updateMarshall.mockClear();
      const listingInput: MarketListingInput = {
         listingName: "Snickers Bar",
         description: "One delicious Snickers bar.",
         image: "https://i.imgur.com/UHm9oTg.jpeg",
         price: 5,
         stock: null
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
            ":stock": null
         }
      };
      marketService.editMarketListing("courseId", "listingId", listingInput);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.updateMarshall).toHaveBeenCalledTimes(1);
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
      };

      const params: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: StudentPK("testCourse"),
            SK: StudentSK("testId")
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

      expect(dynamodbMock.updateMarshall).toBeCalledWith(params);
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
         UF_SK: unfulfilledPrefix,
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

describe("Fulfilling a purchase", () => {
   test("Updates the receipt with the correct params", async () => {
      dynamodbMock.updateMarshall.mockClear();

      const params: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ReceiptPK("courseid"),
            SK: ReceiptSK("receiptid")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression: "set fulfilled = :fulfilled remove UF_SK",
         expressionAttributeValues: {
            ":fulfilled": true
         }
      };
      marketService.fulfillPurchase("courseid", "receiptid", true);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(params);
      expect(dynamodbMock.updateMarshall).toBeCalledTimes(1);
   });
});

describe("Viewing unfulfilled purchases", () => {
   test("Queries with the correct params", async () => {
      dynamodbMock.queryList.mockClear();

      const params: QueryParams = {
         tableName: MARKETPLACE_TABLE,
         indexName: UNFULFILLED_INDEX,
         keyConditionExpression: "PK = :courseVal and begins_with(UF_SK, :ufskPrefix) ",
         expressionAttributeValues: {
            ":courseVal": ReceiptPK("courseid"),
            ":ufskPrefix": unfulfilledPrefix
         }
      };
      marketService.unfulfilledPurchases("courseid");
      expect(dynamodbMock.queryList).toBeCalledWith(params);
      expect(dynamodbMock.queryList).toBeCalledTimes(1);
   });

   test("Only returns specific student when student specified in args", async () => {
      dynamodbMock.queryList.mockClear();

      mocked(dynamodbMock.queryList).mockReturnValue([
         { studentId: "userid" },
         { studentId: "No Thanks" }
      ]);

      expect(await marketService.unfulfilledPurchases("courseid", "userid")).toEqual([
         { studentId: "userid" }
      ]);
      expect(dynamodbMock.queryList).toBeCalledTimes(1);
   });
});

describe("Unfulfilling a purchase", () => {
   test("Updates the receipt with the correct params", async () => {
      dynamodbMock.updateMarshall.mockClear();

      const params: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ReceiptPK("courseid"),
            SK: ReceiptSK("receiptid")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression: "set fulfilled = :fulfilled, UF_SK = :unfulfilledPrefix",
         expressionAttributeValues: {
            ":fulfilled": false,
            ":unfulfilledPrefix": unfulfilledPrefix
         }
      };
      marketService.fulfillPurchase("courseid", "receiptid", false);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(params);
      expect(dynamodbMock.updateMarshall).toBeCalledTimes(1);
   });
});

describe("Making a purchase", () => {
   test("Updating the marketplace listing stats with a stockless item", async () => {
      dynamodbMock.updateMarshall.mockClear();

      const expectedParamArgs: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseid"),
            SK: ListingSK("cupcakeid")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression: "set timesPurchased = timesPurchased + :quantity",
         expressionAttributeValues: {
            ":quantity": 2
         }
      };
      marketService.updateMarketListingStats("courseid", "cupcakeid", 2, false);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.updateMarshall).toBeCalledTimes(1);
   });

   test("Updating the marketplace listing stats with a stocked item", async () => {
      dynamodbMock.updateMarshall.mockClear();

      const expectedParamArgs: UpdateParams = {
         tableName: MARKETPLACE_TABLE,
         key: {
            PK: ListingPK("courseid"),
            SK: ListingSK("cupcakeid")
         },
         conditionExpression: "attribute_exists(SK)",
         updateExpression:
            "set timesPurchased = timesPurchased + :quantity, stock = stock - :quantity",
         expressionAttributeValues: {
            ":quantity": 2
         }
      };
      marketService.updateMarketListingStats("courseid", "cupcakeid", 2, true);
      expect(dynamodbMock.updateMarshall).toBeCalledWith(expectedParamArgs);
      expect(dynamodbMock.updateMarshall).toBeCalledTimes(1);
   });
});

describe("Querying recent course purchases", () => {
   test("Queries with proper args based on input", async () => {
      dynamodbMock.queryList.mockClear();

      const params: QueryParams = {
         tableName: MARKETPLACE_TABLE,
         indexName: COURSE_DATE_INDEX,
         scanIndexForward: false,
         limit: 4,
         keyConditionExpression: "PK = :courseVal and begins_with(D_SK, :dskPrefix) ",
         expressionAttributeValues: {
            ":courseVal": ReceiptPK("courseid"),
            ":dskPrefix": purchaseDatePrefix
         }
      };
      marketService.recentClassPurchases("courseid", 4);
      expect(dynamodbMock.queryList).toBeCalledWith(params);
      expect(dynamodbMock.queryList).toBeCalledTimes(1);
   });
});

describe("Querying recent student purchases", () => {
   test("Queries with proper args based on input", async () => {
      dynamodbMock.queryList.mockClear();

      const params: QueryParams = {
         tableName: MARKETPLACE_TABLE,
         indexName: COURSE_DATE_STUDENT_INDEX,
         scanIndexForward: false,
         limit: 3,
         keyConditionExpression: "PK = :courseVal and begins_with(U_D_SK, :dskPrefix) ",
         expressionAttributeValues: {
            ":courseVal": ReceiptPK("courseid"),
            ":dskPrefix": `${userPrefix}${"studentid"}#${purchaseDatePrefix}`
         }
      };
      marketService.recentStudentPurchases("courseid", "studentid", 3);
      expect(dynamodbMock.queryList).toBeCalledWith(params);
      expect(dynamodbMock.queryList).toBeCalledTimes(1);
   });
});
