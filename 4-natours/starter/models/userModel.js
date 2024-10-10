const mongoose = require('mongoose');
const crypto = require('crypto');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be set'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'An email must be set'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid email...']
    },
    password: {
      type: String,
      required: [true, 'Password must be set'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm Password must be set'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Confirm Password does not match Password'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    slug: String,
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['admin', 'user', 'guest', 'lead-guide', 'guide'],
        message: 'Role is either ||admin|guest|guide|lead-guide|user||'
      }
    },
    description: {
      type: String,
      trim: true,
      default: 'I love this app...'
    },
    photo: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Document middleware before save(), create() but not insertMany()
userSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
