import { STATUS } from "../enums/status";

export function ValidateRegionQuery (lat, lng, fromUser, distance, unit ) {
  if (!lat && !lng) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Missing lat and lng info on query",
    }
  } else if (!lat) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Missing lat info on query",
    }
  } else if (!lng) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Missing lng info on query",
    }
  }

  if(distance) {
    if(unit !== "meters" && unit !== "kilometers") {
      throw {
        status: STATUS.BAD_REQUEST,
        message: "unit should be exatcly 'meters' or 'kilometers'",
      }
    }
  }

}

