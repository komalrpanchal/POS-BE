const mongoose = require("mongoose");

const itemListSchema = new mongoose.Schema({
    category_id: { type: String },
    category_name: { type: String },
    item_id: { type: String },
    itemName: { type: String },
    size_id: { type: String },
    size_name: { type: String },
    customization_details: { type: String },
    choice_details: { type: String },
    item_status: { type: String, enum: ["Pending", "Ready", "served", "picked up"], default: "Pending"  },
    quantity: { type: String },
    cancel_quantity: { type: String, default: "0" }
  });

const sectionDataSchema = new mongoose.Schema({
    section_id: { type: String },
    section_name: { type: String },
    itemList: [itemListSchema]
  });

const kotSchema = new mongoose.Schema({
    order_id: { type: String },
    pos_user_name: { type: String },
    order_type: { type: String, enum: ["dine-in", "take-away"]},
    table_no: { type: String },
    kot_id: { type: String },
    kot_start_time: { type: String },
    kot_end_time: { type: String },
    kot_status: { type: String, enum: ["Pending", "Completed", "Finished"], default: "Pending"  },
    sectionData: [sectionDataSchema]
  });

  kotSchema.pre("save", async function (next) {
    const kot = this; // Access the current KOT document
    if (kot.isModified("order_type")) { // Check if orderType has been changed
        let updateStatus;
      if (kot.order_type === "dine-in") { this.updateStatus = "served" };
      if (kot.order_type === "take-away") { this.updateStatus = "picked-up" };
      kot.sectionData.forEach(section => {
        section.itemList.forEach(item => {
          item.itemStatus = updateStatus;
        });
      });
    }
    next(); // Continue with the save operation
  });
  
  const KOTOrder = mongoose.model("KOTOrder", kotSchema);
  
  module.exports = KOTOrder;