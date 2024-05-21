import { Client } from "@googlemaps/google-maps-services-js";
import * as dotenv from "dotenv";

dotenv.config();

class GeoLib {
  private client = new Client({});

  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number }
  ): Promise<string> {
    try {
      const address = await this.client.reverseGeocode({
        params: {
          latlng: `${coordinates[0]},${coordinates[1]}`,
          key: process.env.GOOGLE_API_KEY,
        },
      });

      const result = address.data.results[0].formatted_address;

      return Promise.resolve(result);
    } catch (error: any) {
      return Promise.reject(new Error("Invalid coordinates"));
    }
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<{ lat: number; lng: number }> {
    try {
      const coordinates = await this.client.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_API_KEY,
        },
      });

      const result = coordinates.data.results[0].geometry.location;

      return Promise.resolve(result);
    } catch (error: any) {
      return Promise.reject(new Error("Invalid address"));
    }
  }
}

export default new GeoLib();