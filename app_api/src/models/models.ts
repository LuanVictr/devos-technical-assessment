import "reflect-metadata";

import * as mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
} from "@typegoose/typegoose";
import lib from "../services/lib";

import ObjectId = mongoose.Types.ObjectId;
import { IRegion } from "../interfaces/IRegion";

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<User>("save", async function (next) {
  const region = this as Omit<any, keyof User> & User;
  if (this.isNew) {
    if (region.isModified("coordinates") && region.isModified("address")) {
      throw new Error("Please insert only coordinates OR only address");
    } else if (region.isModified("coordinates")) {
      region.address = await lib.getAddressFromCoordinates(region.coordinates);
    } else if (region.isModified("address")) {
      const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);
      region.coordinates = [lng, lat];
    }
  }
  next();
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}

@pre<Region>("save", async function (next) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const region = this as Omit<any, keyof Region> & Region;
    if (!region._id) {
      region._id = new ObjectId().toString();
    }
    
    if (region.isNew) {
      if (!region.isModified("name")) {
        throw new Error("Name field is required");
      }
      const user = await UserModel.findOne({ _id: region.user });
      user.regions.push(region._id);
      await user.save({ session: region.$session() });
    }

    await session.commitTransaction();
    session.endSession();

    next(region.validateSync());
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base {
  @Prop({ required: true, auto: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  region: {
    type: string;
    coordinates: [number, number][][];
  };

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}

export const UserModel = getModelForClass(User);
export const RegionModel = getModelForClass(Region);

// create the coordinate prop to save coordinates on regions
