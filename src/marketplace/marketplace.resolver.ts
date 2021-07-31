import { ForbiddenError } from "apollo-server-lambda";
import { notInstructorErrorMessage, TO_GRAPHQL_DATE } from "../environment";
import { RoleInternal } from "../interfaces/role";
import { getStudent } from "../course/courseService";
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

async function awardStudentPoints(
   _: any,
   args: MutationAwardStudentPointsArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      marketService.createActivity(args.courseId, args.student, `Awarded Points`, args.points);

      return (
         await addStudentPoints(args.courseId, args.student, {
            totalPointsAwarded: args.points,
            points: args.points,
            totalPointsSpent: 0
         })
      ).points;
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function awardStudentsPoints(
   _: any,
   args: MutationAwardStudentsPointsArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await Promise.all(
         args.studentIds.map(async id => {
            marketService.createActivity(args.courseId, id, `Awarded Points`, args.points);

            return await addStudentPoints(args.courseId, id, {
               totalPointsAwarded: args.points,
               points: args.points,
               totalPointsSpent: 0
            });
         })
      );
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
      if (args.student) {
         return marketService.recentStudentPurchases(args.course, args.student, args.fetch);
      }
      return marketService.recentClassPurchases(args.course, args.fetch);
   }

   return marketService.recentStudentPurchases(args.course, context.username, args.fetch);
}

async function recentActivity(_: any, args: QueryRecentActivityArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      if (args.student) {
         return marketService.recentStudentActivity(args.course, args.student, args.fetch);
      }
      return marketService.recentClassActivity(args.course, args.fetch);
   }

   return marketService.recentStudentActivity(args.course, context.username, args.fetch);
}

async function refundPurchase(
   _: any,
   args: MutationRefundPurchaseArgs,
   context: FliptedContext
): Promise<boolean> {
   if (context.userRole == RoleInternal.Instructor) {
      return marketService.refundPurchase(args.course, args.receiptId);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function unfulfilledPurchases(
   _: any,
   args: QueryRecentPurchasesArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      if (args.student) {
         return marketService.unfulfilledPurchases(args.course, args.student);
      }
      return marketService.unfulfilledPurchases(args.course);
   }

   return marketService.unfulfilledPurchases(args.course, context.username);
}

async function blockStudentPurchases(
   _: any,
   args: MutationBlockStudentPurchasesArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return marketService.blockStudentPurchases(args.course, args.student, args.blocked)
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function removeStudent(
   _: any,
   args: MutationRemoveStudentArgs,
   context: FliptedContext
) {
   if (context.userRole == RoleInternal.Instructor) {
      return marketService.deleteStudent(args.course, args.student);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

const resolvers = {
   Query: {
      marketListings: marketListings,
      recentPurchases: recentPurchases,
      unfulfilledPurchases: unfulfilledPurchases,
      recentActivity
   },
   Mutation: {
      blockStudentPurchases: blockStudentPurchases,
      refundPurchase: refundPurchase,
      purchase: purchase,
      addMarketListing: addMarketListing,
      removeMarketListing: removeMarketListing,
      removeStudent,
      editMarketListing: editMarketListing,
      awardStudentPoints: awardStudentPoints,
      awardStudentsPoints: awardStudentsPoints,
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
   },
   Activity: {
      activityDate: (parent: any) => {
         return TO_GRAPHQL_DATE(parent.activityDate);
      }
   }
};

export default resolvers;
