import mongoose from 'mongoose';
import { shipmentTrackingLogType } from '../types/shipmentTrackingLog.types';

const shipmentTrackingLogSchema = new mongoose.Schema<shipmentTrackingLogType>(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'orders',
    },
    status: { type: String, required: true },
    location: { type: Location, required: true },
    carrier: { type: String, required: true },
    tracking_number: { type: String, required: true },
    // shipment_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Shipments',
    // },
    logs: [
      {
        status: { type: String, required: true },
        location: { type: Location, required: true },
        arrived_at: { type: Date, required: true },
      },
    ],
  },
  {
    collection: 'shipment_tracking_logs',
    timestamps: true,
  },
);

export const ShipmentTrackingLog: mongoose.Model<shipmentTrackingLogType> =
  mongoose.models.ShipmentTrackingLog ||
  mongoose.model<shipmentTrackingLogType>(
    'shipment_tracking_log',
    shipmentTrackingLogSchema,
  );
