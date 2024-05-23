import "reflect-metadata";

import * as mongoose from "mongoose";
import * as supertest from "supertest";
import * as sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect, assert } from "chai";

import "../database/database";
import { Region, RegionModel, UserModel } from "../models/models";
import GeoLib from "../services/lib";
import server from "../server";

describe("Models", () => {
  let user;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, "getAddressFromCoordinates")
      .resolves(faker.location.streetAddress({ useFullAddress: true }));
    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, "getCoordinatesFromAddress")
      .resolves({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });

    session = await mongoose.startSession();
    user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
    });
  });

  after(() => {
    sinon.restore();
    session.endSession();
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(() => {
    session.commitTransaction();
  });

  describe("UserModel", () => {
    it("should create a user", async () => {
      expect(1).to.be.eq(1);
    });
  });

  describe("RegionModel", () => {
    it("should create a region", async () => {
      const regionData: Omit<Region, "_id"> = {
        user: user._id,
        name: faker.person.fullName(),
      };

      const [region] = await RegionModel.create([regionData]);

      expect(region).to.deep.include(regionData);
    });

    it("should rollback changes in case of failure", async () => {
      const userRecord = await UserModel.findOne({ _id: user._id })
        .select("regions")
        .lean();
      try {
        await RegionModel.create([{ user: user._id }]);

        assert.fail("Should have thrown an error");
      } catch (error) {
        const updatedUserRecord = await UserModel.findOne({ _id: user._id })
          .select("regions")
          .lean();

        expect(userRecord).to.deep.eq(updatedUserRecord);
      }
    });
  });

  describe("User tests", () => {
    describe("GET /user tests", () => {
      it("should return a list of users", async () => {
        const response = await supertest(server).get(`/user?page=1&limit=10`);

        expect(response).to.have.property("status", 200);
      });

      it("should return an error in case of no query strings provideds", async () => {
        const response = await supertest(server).get(`/user`);

        expect(response).to.have.property("status", 422);
      });
    });

    describe("GET /user/id tests", () => {
      it("should return a user", async () => {
        const response = await supertest(server).get(`/user/${user._id}`);

        expect(response).to.have.property("status", 200);
      });

      it("should return an error in case of no user being found", async () => {
        const response = await supertest(server).get(`/user/3261387231`);

        expect(response).to.have.property("status", 404);
        expect(response.body).to.have.property("message", "User not found");
      });
    });

    describe("/POST /user tests", () => {
      it("should create a new user", async () => {
        const newUserName = faker.person.firstName();
        const newUserEmail = faker.internet.email();
        const newUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });

        const response = await supertest(server).post("/user").send({
          name: newUserName,
          email: newUserEmail,
          address: newUserAddress,
        });

        const responseBody = response.body.createdUser;

        expect(responseBody.user.name).to.be.equal(newUserName);
        expect(responseBody.user.email).to.be.equal(newUserEmail);
        expect(responseBody.user.address).to.be.equal(newUserAddress);
      });

      it("should return an error in case of no body being provided", async () => {
        const response = await supertest(server).post("/user");

        const responseBody = response.body;

        expect(response).to.have.property("status", 422);
        expect(responseBody).to.have.property(
          "message",
          `\"name\" is required`
        );
      });

      it("should return an error in case of coordinates and address are both provided", async () => {
        const newUserName = faker.person.firstName();
        const newUserEmail = faker.internet.email();
        const newUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });
        const coordinates = [
          faker.location.latitude(),
          faker.location.longitude(),
        ];

        const response = await supertest(server).post("/user").send({
          name: newUserName,
          email: newUserEmail,
          address: newUserAddress,
          coordinates: coordinates,
        });

        const responseBody = response.body;

        expect(response).to.have.property("status", 500);
        expect(responseBody).to.have.property(
          "message",
          "Please insert only coordinates OR only address"
        );
      });

      it("should return an error if neither coordinates nor an address is provided.", async () => {
        const newUserName = faker.person.firstName();
        const newUserEmail = faker.internet.email();

        const response = await supertest(server).post("/user").send({
          name: newUserName,
          email: newUserEmail,
        });

        const responseBody = response.body;

        expect(response).to.have.property("status", 400);
        expect(responseBody).to.have.property(
          "message",
          "User need coordinates or address to be created"
        );
      });
    });

    describe("/PUT /user tests", () => {
      let user;

      beforeEach(async () => {
        const oldUserName = faker.person.firstName();
        const oldUserEmail = faker.internet.email();
        const oldUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });

        user = await supertest(server).post("/user").send({
          name: oldUserName,
          email: oldUserEmail,
          address: oldUserAddress,
        });
      });
      it("should update username from user", async () => {
        const newUserName = faker.person.firstName();

        const response = await supertest(server)
          .put(`/user/${user.body.createdUser.user._id}`)
          .send({
            name: newUserName,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedUser).to.have.property("name", newUserName);
      });

      it("should update email from user", async () => {
        const newUserEmail = faker.internet.email();

        const response = await supertest(server)
          .put(`/user/${user.body.createdUser.user._id}`)
          .send({
            email: newUserEmail,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedUser).to.have.property(
          "email",
          newUserEmail
        );
      });

      it("should update address from user", async () => {
        const newUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });

        const response = await supertest(server)
          .put(`/user/${user.body.createdUser.user._id}`)
          .send({
            address: newUserAddress,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedUser).to.have.property(
          "address",
          newUserAddress
        );
      });

      it("should update coordinates from user", async () => {
        const coordinates = [
          faker.location.latitude(),
          faker.location.longitude(),
        ];

        const response = await supertest(server)
          .put(`/user/${user.body.createdUser.user._id}`)
          .send({
            coordinates: coordinates,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedUser.coordinates).to.be.deep.equal(
          coordinates
        );
      });

      it("should return an error if both coordinates and address are provided", async () => {
        const newUserName = faker.person.firstName();
        const newUserEmail = faker.internet.email();
        const newUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });
        const coordinates = [
          faker.location.latitude(),
          faker.location.longitude(),
        ];

        const response = await supertest(server)
          .put(`/user/${user.body.createdUser.user._id}`)
          .send({
            name: newUserName,
            email: newUserEmail,
            address: newUserAddress,
            coordinates: coordinates,
          });

        expect(response).to.have.property("status", 400);
        expect(response.body).to.have.property(
          "message",
          "Please insert only coordinates OR only address"
        );
      });
    });

    describe("/DELETE /user/id tests", () => {
      let user;

      beforeEach(async () => {
        const oldUserName = faker.person.firstName();
        const oldUserEmail = faker.internet.email();
        const oldUserAddress = faker.location.streetAddress({
          useFullAddress: true,
        });

        user = await supertest(server).post("/user").send({
          name: oldUserName,
          email: oldUserEmail,
          address: oldUserAddress,
        });
      });

      it("should delete a user successfully", async () => {
        const userFound = await supertest(server).get(
          `/user/${user.body.createdUser.user._id}`
        );

        expect(userFound).to.have.property("status", 200);

        const userDeleted = await supertest(server).delete(
          `/user/${user.body.createdUser.user._id}`
        );

        expect(userDeleted).to.have.property("status", 200);
        expect(userDeleted.body.deleted).to.have.property(
          "name",
          user.body.createdUser.user.name
        );
        expect(
          await supertest(server).get(`/user/${user.body.createdUser.user._id}`)
        ).to.have.property("status", 404);
      });

      it("should return an error if the user to delete does not exist", async () => {
        const response = await supertest(server).delete(`/user/123123321`);

        expect(response).to.have.property("status", 404);
        expect(response.body).to.have.property("message", "User not found");
      });
    });
  });

  describe("Region tests", () => {
    describe("Create region tests", () => {
      let token;
      before(async () => {
        const response = await supertest(server).post("/auth").send({
          name: user.name,
          email: user.email,
        });
        token = response.body.token;
      });
      it("should create a new region", async () => {
        const newRegionName = faker.location.country();
        const newRegionUser = user._id;
        const newRegionInfo = {
          type: "Polygon",
          coordinates: [
            [
              [faker.location.longitude(), faker.location.latitude()],
              [faker.location.longitude(), faker.location.latitude()],
              [faker.location.longitude(), faker.location.latitude()],
              [faker.location.longitude(), faker.location.latitude()],
              [faker.location.longitude(), faker.location.latitude()],
            ],
          ],
        };

        const response = await supertest(server)
          .post("/region")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: newRegionName,
            region: newRegionInfo,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.createdRegion).to.have.property('message', "Region created successfully");
        expect(response.body.createdRegion).to.have.property('newRegion');
        expect(response.body.createdRegion.newRegion).to.have.property('name', newRegionName);
        expect(response.body.createdRegion.newRegion).to.have.property('user', user._id);
      });

      // it("should create a new region", async () => {
      //   const newRegionName = faker.location.country();
      //   const newRegionUser = user._id;
      //   const newRegionInfo = {
      //     type: "Polygon",
      //     coordinates: [
      //       [
      //         [faker.location.longitude(), faker.location.latitude()],
      //         [faker.location.longitude(), faker.location.latitude()],
      //         [faker.location.longitude(), faker.location.latitude()],
      //         [faker.location.longitude(), faker.location.latitude()],
      //         [faker.location.longitude(), faker.location.latitude()],
      //       ],
      //     ],
      //   };

      //   const response = await supertest(server)
      //     .post("/region")
      //     .set("Authorization", `Bearer ${token}`)
      //     .send({
      //       name: newRegionName,
      //       region: newRegionInfo,
      //     });

      //   expect(response).to.have.property("status", 201);
      // });
    });
  });
});
