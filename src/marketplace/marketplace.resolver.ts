import { ForbiddenError } from "apollo-server-lambda";
import { notInstructorErrorMessage, TO_GRAPHQL_DATE } from "../environment";
import { RoleInternal } from "../interfaces/role";
import { getStudent } from "../roster/rosterService";
import { Resolvers } from "../__generated__/resolvers";
import { ReceiptItem, StudentPointValues } from "./marketplace.interface";
import * as marketService from "./marketplace.service";
import { addStudentPoints } from "./marketplace.service";

async function addMarketListing(
   _: any,
   args: MutationAddMarketListingArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await marketService.addMarketListing(args.course, args.listing);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function removeMarketListing(
   _: any,
   args: MutationRemoveMarketListingArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await marketService.removeMarketListing(args.course, args.id);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function editMarketListing(
   _: any,
   args: MutationEditMarketListingArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await marketService.editMarketListing(args.course, args.id, args.listing);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function marketListings(_: any, args: QueryMarketListingsArgs) {
   return marketService.getMarketListings(args.course);
}

async function purchase(
   _: any,
   args: MutationPurchaseArgs,
   context: FliptedContext
): Promise<Omit<Receipt, "student" | "listing" | "purchaseDate">> {
   return marketService.executePurchase(
      args.course,
      args.listingId,
      context.username,
      args.quantity,
      args.note
   );
}

async function changePoints(_: any, args: MutationChangePointsArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      return (
         await addStudentPoints(args.course, args.student, {
            totalPointsAwarded: args.points,
            points: args.points,
            totalPointsSpent: 0
         })
      ).points;
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function fulfillPurchase(_: any, args: MutationFulfillPurchaseArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      return marketService.fulfillPurchase(args.course, args.receiptId, args.fulfilled);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function recentPurchases(_: any, args: QueryRecentPurchasesArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      if(args.student) {
         return marketService.recentStudentPurchases(args.course, args.student, args.fetch);
      }
      return marketService.recentClassPurchases(args.course, args.fetch);
   } 

   return marketService.recentStudentPurchases(args.course, context.username, args.fetch);
}

const resolvers = {
   Query: {
      marketListings: marketListings,
      recentPurchases: recentPurchases
   },
   Mutation: {
      purchase: purchase,
      addMarketListing: addMarketListing,
      removeMarketListing: removeMarketListing,
      editMarketListing: editMarketListing,
      changePoints: changePoints,
      fulfillPurchase: fulfillPurchase
   },
   MarketListing: {
      // TODO: will break if not from a market listing item
      listedDate: (parent: any) => {
         return TO_GRAPHQL_DATE(parent.listedDate);
      }
   },
   Receipt: {
      purchaseDate: (parent: any) => {
         return TO_GRAPHQL_DATE(parent.purchaseDate);
      },
      student: (parent: Receipt) => {
         return getStudent(parent.course, parent.studentId);
      },
      listing: (parent: ReceiptItem) => {
         return marketService.getMarketListing(parent.course, parent.listingId);
      }
   }
};

export default resolvers;
