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
  let region;
  let session;
  let controlledRegion;
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

    region = await RegionModel.create({
      user: user._id,
      name: faker.location.country(),
      region: {
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
      },
    });

    controlledRegion = await RegionModel.create({
      user: user._id,
      name: "central park",
      region: {
        type: "Polygon",
        coordinates: [
          [
            [-73.98178100585938, 40.768020857734],
            [-73.95832061767578, 40.80090536006155],
            [-73.94962310791016, 40.81124086971714],
            [-73.96781921386719, 40.82667403129942],
            [-73.9794921875, 40.773565541152725],
            [-73.98178100585938, 40.768020857734]
          ]
        ]
      }
    });
  });

   // create central park if not exists and do testing of the last method, document and é isso

  after(async () => {
    await UserModel.deleteOne({_id: user._id});
    await RegionModel.deleteOne({_id: region._id});
    await RegionModel.deleteOne({_id: controlledRegion._id});
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
        region: {
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
        },
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

    describe("POST /user tests", () => {
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

    describe("PUT /user tests", () => {
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

    describe("DELETE /user/id tests", () => {
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
    let token;
    before(async () => {
      const response = await supertest(server).post("/auth").send({
        name: user.name,
        email: user.email,
      });
      token = response.body.token;
    });
    describe("POST /region tests", () => {
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
        expect(response.body.createdRegion).to.have.property(
          "message",
          "Region created successfully"
        );
        expect(response.body.createdRegion).to.have.property("newRegion");
        expect(response.body.createdRegion.newRegion).to.have.property(
          "name",
          newRegionName
        );
        expect(response.body.createdRegion.newRegion).to.have.property(
          "user",
          user._id
        );
      });
    });

    describe("GET region tests", () => {
      it("should get a region by id", async () => {
        const response = await supertest(server)
          .get(`/region/${region._id}`)
          .set("Authorization", `Bearer ${token}`);

        const regionFound = response.body;

        expect(regionFound).to.have.property("name", region.name);
        expect(regionFound).to.have.property("region");
        expect(regionFound).to.have.property("user", region.user);
        expect(regionFound.region).to.have.property("type", region.region.type);
        expect(regionFound.region.coordinates).to.be.deep.equal(
          region.region.coordinates
        );
      });

      it("should return an error if region does not exists", async () => {
        const response = await supertest(server)
          .get(`/region/362131629831`)
          .set("Authorization", `Bearer ${token}`);

        const regionFound = response;

        expect(regionFound).to.have.property("status", 404);
        expect(regionFound.body).to.have.property(
          "message",
          "Region not found"
        );
      });

      it("should return all regions that have a provided point", async () => {
        const mockRegion = await RegionModel.create({
          user: user._id,
          name: faker.location.country(),
          region: {
            type: "Polygon",
            coordinates: [
              [
                [
                  -40.36337744086629,
                  -3.665467668665883
                ],
                [
                  -40.36337744086629,
                  -3.7025787359750666
                ],
                [
                  -40.327369760237275,
                  -3.7025787359750666
                ],
                [
                  -40.327369760237275,
                  -3.665467668665883
                ],
                [
                  -40.36337744086629,
                  -3.665467668665883
                ]
              ]
            ],
          },
        });

        const response = await supertest(server)
          .get(`/region?lat=-40.345373600551785&lng=-3.684023202320475`)
          .set("Authorization", `Bearer ${token}`);

        expect(response).to.have.property("status", 200);
      });

      it("should return a region that have a provided distance from a provided point", async () => {

        const response = await supertest(server)
          .get(`/region?lat=-73.9767837524414&lng=40.77978539702517&distance=1000&unit=meters&fromUser=false`)
          .set("Authorization", `Bearer ${token}`);

          console.log('response -->', response.body);

          const responseBody = response.body.regionsFromDistance

        expect(response).to.have.property("status", 200);
        expect(response.body[0]).to.have.property("name", controlledRegion.name);
        expect(response.body[0]).to.have.property("user", user._id);
        expect(response.body[0]).to.have.property("region");
        expect(response.body[0].region.coordinates).to.be.deep.equal(controlledRegion.region.coordinates);
      });
    });

    describe("PUT /region tests", () => {
      let region;

      beforeEach(async () => {
        region = await supertest(server)
          .post("/region")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: faker.person.fullName(),
            region: {
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
            },
          });
      });

      it("should update name from region", async () => {
        const newRegionName = faker.location.country();

        const response = await supertest(server)
          .put(`/region/${region.body.createdRegion.newRegion._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: newRegionName,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedRegion).to.have.property(
          "name",
          newRegionName
        );
      });

      it("should update user from region", async () => {
        const userToRecieveRegion = await UserModel.create({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          address: faker.location.streetAddress({ useFullAddress: true }),
        });

        const userWithRegion = await UserModel.findOne({ _id: user._id });
        const hasRegion = userWithRegion.regions.includes(
          region.body.createdRegion.newRegion._id
        );

        expect(hasRegion).to.be.true;

        const response = await supertest(server)
          .put(`/region/${region.body.createdRegion.newRegion._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            user: userToRecieveRegion._id,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedRegion).to.have.property(
          "user",
          userToRecieveRegion._id
        );
        expect(
          (await UserModel.findOne({ _id: user._id })).regions.includes(
            region.body.createdRegion.newRegion._id
          )
        ).to.be.false;
      });

      it("should update coordinates from region", async () => {
        const coordinates = [
          [
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
          ],
        ];

        const response = await supertest(server)
          .put(`/region/${region.body.createdRegion.newRegion._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            coordinates: coordinates,
          });

        expect(response).to.have.property("status", 201);
        expect(response.body.updatedRegion.region.coordinates).to.be.deep.equal(
          coordinates
        );
      });

      it("should return an error if body is on wrong format", async () => {
        const response = await supertest(server)
          .put(`/region/${region.body.createdRegion.newRegion._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: faker.person.fullName(),
            region: {
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
            },
          });

        expect(response).to.have.property("status", 422);
      });
    });

    describe("DELETE /region tests", () => {
      let region;

      beforeEach(async () => {
        region = await supertest(server)
          .post("/region")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: faker.person.fullName(),
            region: {
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
            },
          });
      });

      it("should delete a region successfully", async () => {
        const regionFound = await supertest(server)
          .get(`/region/${region.body.createdRegion.newRegion._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(regionFound).to.have.property("status", 200);

        const regionDeleted = await supertest(server)
          .delete(`/region/${regionFound.body._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(regionDeleted).to.have.property("status", 200);
        expect(regionDeleted.body.deletedRegion).to.have.property(
          "name",
          region.body.createdRegion.newRegion.name
        );
        expect(
          await supertest(server)
            .get(`/region/${region._id}`)
            .set("Authorization", `Bearer ${token}`)
        ).to.have.property("status", 404);
      });

      it("should return an error if the region to delete does not exist", async () => {
        const response = await supertest(server)
          .delete(`/region/123123321`)
          .set("Authorization", `Bearer ${token}`);

        expect(response).to.have.property("status", 404);
        expect(response.body).to.have.property(
          "message",
          "Region does not exist"
        );
      });
      10;
    });
  });
});
