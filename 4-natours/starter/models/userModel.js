const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be set'],
      unique: [true, 'The name must be unique'],
      trim: true,
      maxlength: [40, 'Name can not exceed 40 character'],
      minlength: [10, 'Name should exceed 10 character']
      // validate: [validator.isAlpha, 'The name must only contain letters']
    },
    email: {
      type: String,
      required: [true, 'An email must be set'],
      unique: [true, 'The email must be unique'],
      trim: true,
      maxlength: [50, 'Email can not exceed 40 character'],
      minlength: [10, 'Email should exceed 10 character']
      // validate: [validator.isAlpha, 'The name must only contain letters']
    },
    password: {
      type: String,
      required: [true, 'An email must be set']
      // validate: [validator.isAlpha, 'The name must only contain letters']
    },
    slug: String,
    role: {
      type: String,
      required: [true, 'Role must be set'],
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
      type: String,
      required: [true, 'Photo must be set']
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

const User = mongoose.model('User', userSchema);

module.exports = User;
