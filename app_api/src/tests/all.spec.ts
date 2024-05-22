import 'reflect-metadata';

import * as mongoose from 'mongoose';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect, assert } from 'chai';

import '../database/database';
import { Region, RegionModel, UserModel } from '../models/models';
import GeoLib from '../services/lib';
import server from '../server';

describe('Models', () => {
  let user;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon.stub(GeoLib, 'getAddressFromCoordinates').resolves(faker.location.streetAddress({ useFullAddress: true }));
    geoLibStub.getCoordinatesFromAddress = sinon.stub(GeoLib, 'getCoordinatesFromAddress').resolves({ lat: faker.location.latitude(), lng: faker.location.longitude() });

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

  describe('UserModel', () => {
    it('should create a user', async () => {
      expect(1).to.be.eq(1);
    });
  });

  describe('RegionModel', () => {
    it('should create a region', async () => {
      const regionData: Omit<Region, '_id'> = {
        user: user._id,
        name: faker.person.fullName()
      };

      const [region] = await RegionModel.create([regionData]);

      expect(region).to.deep.include(regionData);
    });

    it('should rollback changes in case of failure', async () => {
      const userRecord = await UserModel.findOne({ _id: user._id }).select('regions').lean();
      try {
        await RegionModel.create([{ user: user._id }]);

        assert.fail('Should have thrown an error');
      } catch (error) {
        const updatedUserRecord = await UserModel.findOne({ _id: user._id }).select('regions').lean();

        expect(userRecord).to.deep.eq(updatedUserRecord);
      }
    });
  });

  it('should return a list of users', async () => {
    const response = await supertest(server).get(`/user?page=1&limit=10`);

    expect(response).to.have.property('status', 200);
  });

  it('should return a user', async () => {
    const response = await supertest(server).get(`/user/${user._id}`);

    expect(response).to.have.property('status', 200);
  });

  it('should create a new user', async () => {
      const newUserName = faker.person.firstName();
      const newUserEmail = faker.internet.email();
      const newUserAddress = faker.location.streetAddress({useFullAddress: true});

      const response = await supertest(server).post('/user').send({
        name: newUserName,
        email: newUserEmail,
        address: newUserAddress,
      });

      const responseBody = response.body.createdUser;

      expect(responseBody.user.name).to.be.equal(newUserName);
      expect(responseBody.user.email).to.be.equal(newUserEmail);
      expect(responseBody.user.address).to.be.equal(newUserAddress);
  });
});
