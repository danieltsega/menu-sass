import mongoose, { Schema, Document } from 'mongoose';

export interface IBlacklistedToken {
  token: string;
  expiresAt: Date;
}

export interface IBlacklistedTokenDocument extends IBlacklistedToken, Document<string> {}

const blacklistedTokenSchema = new Schema<IBlacklistedTokenDocument>({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

const BlacklistedToken = mongoose.model<IBlacklistedTokenDocument>(
  'BlacklistedToken',
  blacklistedTokenSchema
);

export default BlacklistedToken;