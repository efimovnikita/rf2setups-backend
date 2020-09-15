const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const app = express();

app.use(cors({ origin: true }));

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// routes

app.get("/getinit", async (req, res) => {
  const snapshotCars = await db.collection("cars").get();
  const snapshotTracks = await db.collection("tracks").get();
  const snapshotSetups = await db.collection("setups").get();

  let cars = [];
  let tracks = [];
  let setups = [];

  snapshotCars.docs.forEach((car) => {
    let carObj = {
      Id: car.id,
      Brand: car.data().Brand,
      Model: car.data().Model,
      CLass: car.data().Class,
      Date: car.data().Date,
      CarBrandImageURL: car.data().CarBrandImageURL,
    };
    cars.push(carObj);
  });

  snapshotTracks.docs.forEach((track) => {
    let trackObj = {
      Id: track.id,
      Name: track.data().Name,
      Date: track.data().Date,
      TrackMapImageURL: track.data().TrackMapImageURL,
    };
    tracks.push(trackObj);
  });

  snapshotSetups.docs.forEach((setup) => {
    let setupObj = {
      Id: setup.id,
      Name: setup.data().Name,
      Date: setup.data().Date,
      Car: setup.data().Car,
      Track: setup.data().Track,
      Tyres: setup.data().Tyres,
      Brakes: setup.data().Brakes,
      Suspension: setup.data().Suspension,
      Aerodynamics: setup.data().Aerodynamics,
      Electronics: setup.data().Electronics,
      DriveTrain: setup.data().DriveTrain,
    };
    setups.push(setupObj);
  });

  return res.status(200).json({ Cars: cars, Tracks: tracks, Setups: setups });
});

app.post("/addsetup", async (req, res) => {
  try {
    var body = req.body;

    var id = body.id;
    var name = body.name;
    var date = body.date;
    var car = body.car;
    var track = body.track;
    var aerodynamics = {
      frontWing: body.aerodynamics.frontWing,
      rearWing: body.aerodynamics.rearWing,
    };
    var brakes = {
      frontBrakeBias: body.brakes.frontBrakeBias,
      maxPedalForce: body.brakes.maxPedalForce,
      rearBrakeBias: body.brakes.rearBrakeBias,
    };
    var electronics = {
      tractionControl: body.electronics.tractionControl,
      abs: body.electronics.abs,
    };
    var tyres = {
      frontCompound: body.tyres.frontCompound,
      frontLeftCamber: body.tyres.frontLeftCamber,
      frontRightCamber: body.tyres.frontRightCamber,
      rearCompound: body.tyres.rearCompound,
      rearLeftCamber: body.tyres.rearLeftCamber,
      rearRightCamber: body.tyres.rearRightCamber,
    };
    var suspension = {
      frontSpringRateRight: body.suspension.frontSpringRateRight,
      rearSpringRateLeft: body.suspension.rearSpringRateLeft,
      rearSpringRateRight: body.suspension.rearSpringRateRight,
      frontSlowBumpLeft: body.suspension.frontSlowBumpLeft,
      frontSlowBumpRight: body.suspension.frontSlowBumpRight,
      rearSlowBumpLeft: body.suspension.rearSlowBumpLeft,
      rearSlowBumpRight: body.suspension.rearSlowBumpRight,
      frontSlowReboundLeft: body.suspension.frontSlowReboundLeft,
      frontSlowReboundRight: body.suspension.frontSlowReboundRight,
      rearSlowReboundLeft: body.suspension.rearSlowReboundLeft,
      rearSlowReboundRight: body.suspension.rearSlowReboundRight,
      frontFastBumpLeft: body.suspension.frontFastBumpLeft,
      frontFastBumpRight: body.suspension.frontFastBumpRight,
      rearFastBumpLeft: body.suspension.rearFastBumpLeft,
      rearFastBumpRight: body.suspension.rearFastBumpRight,
      frontFastReboundLeft: body.suspension.frontFastReboundLeft,
      frontFastReboundRight: body.suspension.frontFastReboundRight,
      rearFastReboundLeft: body.suspension.rearFastReboundLeft,
      rearFastReboundRight: body.suspension.rearFastReboundRight,
      frontPackersLeft: body.suspension.frontPackersLeft,
      frontPackersRight: body.suspension.frontPackersRight,
      rearPackersLeft: body.suspension.rearPackersLeft,
      rearPackersRight: body.suspension.rearPackersRight,
      frontRideHeightLeft: body.suspension.frontRideHeightLeft,
      frontRideHeightRight: body.suspension.frontRideHeightRight,
      rearRideHeightLeft: body.suspension.rearRideHeightLeft,
      rearRideHeightRight: body.suspension.rearRideHeightRight,
      frontAntisway: body.suspension.frontAntisway,
      rearAntisway: body.suspension.rearAntisway,
      frontToeIn: body.suspension.frontToeIn,
      rearToeIn: body.suspension.rearToeIn,
    };

    var driveTrain = {
      preload: body.driveTrain.preload,
    };

    db.collection("setups")
      .doc("/" + id + "/")
      .create({
        Name: name,
        Date: date,
        Car: car,
        Track: track,
        Aerodynamics: aerodynamics,
        Brakes: brakes,
        Electronics: electronics,
        Tyres: tyres,
        Suspension: suspension,
        DriveTrain: driveTrain,
      });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.delete("/deletesetup", async (req, res) => {
  try {
    var id = req.query.id;
    db.collection("setups")
      .doc("/" + id + "/")
      .delete();

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

exports.api = functions.https.onRequest(app);
