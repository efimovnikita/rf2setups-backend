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
    };
    setups.push(setupObj);
  });

  return res.status(200).json({ Cars: cars, Tracks: tracks, Setups: setups });
});

app.post("/addsetup", async (req, res) => {
  try {
    var id = req.body.id;
    var name = req.body.name;
    var date = req.body.date;
    var car = req.body.car;
    var track = req.body.track;

    db.collection("setups")
      .doc("/" + id + "/")
      .create({
        Name: name,
        Date: date,
        Car: car,
        Track: track,
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
