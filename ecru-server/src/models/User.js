import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // select:false keeps the hash out of normal queries so we never leak it
    // by accident (e.g. in /auth/me). We opt back in only when logging in.
    password: { type: String, required: true, minlength: 6, select: false },

    // Authorization role. Defaults to 'user' so the public register route can
    // never create an admin — admins are promoted deliberately (see makeAdmin).
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true },
)

// Hash only when the password actually changed, so profile edits don't
// double-hash an already-hashed value.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password)
}

export default mongoose.model('User', userSchema)
