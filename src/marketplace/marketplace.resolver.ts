import { ForbiddenError } from "apollo-server-lambda";
import { notInstructorErrorMessage, TO_GRAPHQL_DATE } from "../environment";
import { RoleInternal } from "../interfaces/role";
import { getStudent } from "../roster/rosterService";
import { Resolvers } from "../__generated__/resolvers";
import { StudentPointValues } from "./marketplace.interface";
import * as marketService from "./marketplace.service";
import { addStudentPoints } from "./marketplace.service";

async function addMarketListing(
   _: any,
   args: MutationAddMarketListingArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await marketService.addMarketListing(args.course, args.listing);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function removeMarketListing(
   _: any,
   args: MutationRemoveMarketListingArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      return await marketService.removeMarketListing(args.course, args.id);
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

async function marketListings(
   _: any,
   args: QueryMarketListingsArgs,
   context: FliptedContext,
   info: any
) {
   return marketService.getMarketListings(args.course);
}

async function changePoints(
   _: any,
   args: MutationChangePointsArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      return (await addStudentPoints(args.course, args.student, args.points)).points;
   }

   throw new ForbiddenError(notInstructorErrorMessage);
}

const resolvers: Resolvers = {
   Query: {
      marketListings: marketListings
   },
   Mutation: {
      addMarketListing: addMarketListing,
      removeMarketListing: removeMarketListing,
      changePoints: changePoints
   },
   MarketListing: {
      listedDate: (parent: any) => {
         return TO_GRAPHQL_DATE(parent.listedDate);
      }
   }
};

export default resolvers;
