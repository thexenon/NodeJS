const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
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
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Duration must be set']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'MaxGroupSize must be set']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty must be set'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either ||easy|medium|difficult||'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'Price must be set']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) can not be higher than price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Description must be set']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'ImageCover must be set']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Document middleware before save(), create() but not insertMany()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// Query middleware
tourSchema.pre(/^find/, function(next) {
  // tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function(doc, next) {
  this.find({ secretTour: { $ne: true } });
  // console.log(`${Date.now()}`);
  // console.log(`Query lasted: ${Date.now() - this.start} milliseconds`);

  next();
});

// Aggregate
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
