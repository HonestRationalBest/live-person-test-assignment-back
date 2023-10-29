import express from "express";
import haversine from "haversine";

import { House } from "../models/House";

interface HouseInterface {
  id?: number;
  houseName: string;
  numberOfRooms: number;
  builtDate: Date;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  distance?: number;
}

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const house = await House.create(req.body);
    res.status(201).json(house);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/", async (req, res) => {
  try {
    const houses = await House.findAll();
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    await house.update(req.body);
    res.json(house);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    await house.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/top5", async (req, res) => {
  try {
    const houses = await House.findAll({
      order: [["numberOfRooms", "DESC"]],
      limit: 5,
    });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/nearby", async (req, res) => {
  const latitude: number = parseFloat(req.query.latitude as string);
  const longitude: number = parseFloat(req.query.longitude as string);

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required!" });
  }

  try {
    const houses = await House.findAll();
    const start = {
      latitude: latitude,
      longitude: longitude,
    };

    for (let house of houses) {
      (house as HouseInterface).distance = haversine(start, {
        latitude: house.latitude,
        longitude: house.longitude,
      });
    }

    houses.sort((a: HouseInterface, b: HouseInterface) => {
      if (a.distance !== b.distance && a.distance && b.distance) {
        return a.distance - b.distance;
      } else if (a.numberOfRooms !== b.numberOfRooms) {
        return b.numberOfRooms - a.numberOfRooms;
      } else {
        return b.builtDate.getTime() - a.builtDate.getTime();
      }
    });

    res.json(houses.slice(0, 3));
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
