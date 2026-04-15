import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Format: { "/module/path": { create: Boolean, read: Boolean, update: Boolean, delete: Boolean } }
    },
  },
  { timestamps: true }
);

const RoleModel = mongoose.model('Role', roleSchema);
export default RoleModel;
