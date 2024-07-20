const KOT = require("../models/kotModel");
const factory = require("../utils/handlerFactory");

exports.getAllkot = async (req, res, next) => {
    const kot = await KOT.find();
    res.status(200).json({
      status: "success",
      results: kot.length,
      data: kot
    });
  };

  exports.createKOT = factory.createOne(KOT);