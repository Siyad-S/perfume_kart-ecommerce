import mongoose from "mongoose";

export interface shipmentTrackingLogType extends Document {
  order_id: mongoose.Types.ObjectId;
  status: string;
  location: Location;
  carrier: string;
  tracking_number: string;
  logs: [
    {
      status: string;
      location: Location;
      arrived_at: Date;
    },
  ];
  is_deleted: boolean;
  updated_at: Date;
  created_at: Date;
}