const mongoose = require('mongoose');

const preEnrollmentSchema = new mongoose.Schema({
  enrollerId: {
    type: String,
    unique: true,
    // Will be set before saving
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP/Postal code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  package: {
    type: String,
    required: [true, 'Package selection is required'],
    enum: ['STARTER', 'ELITE', 'PRO']
  },
  packageDetails: {
    price: Number,
    monthlyFee: Number,
    initialSV: Number,
    monthlySV: Number,
    fastStartBonus: Number
  },
  placement: {
    leg: {
      type: String,
      enum: ['LEFT', 'RIGHT'],
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  sponsorId: {
    type: String,
    default: 'KEVIN_GARDNER_5', // Kevin Gardner's ID as the 5th pre-enrollee
    required: true
  },
  enrollmentNumber: {
    type: Number,
    unique: true,
    // Will be set before saving
  }
});

// Pre-save middleware to generate enrollerId and enrollmentNumber
preEnrollmentSchema.pre('save', async function(next) {
  if (!this.enrollmentNumber) {
    // Get the current count of enrollments and add 1
    const count = await this.constructor.countDocuments();
    this.enrollmentNumber = count + 1;
    
    // Generate enrollerId: TF-2025-XXXX (where XXXX is padded enrollment number)
    this.enrollerId = `TF-2025-${String(this.enrollmentNumber).padStart(4, '0')}`;

    // Calculate leg placement (alternate between left and right)
    if (!this.placement.leg) {
      const lastEnrollment = await this.constructor.findOne().sort({ enrollmentNumber: -1 });
      this.placement.leg = lastEnrollment?.placement.leg === 'LEFT' ? 'RIGHT' : 'LEFT';
      this.placement.position = count + 1;
    }
  }
  next();
});

module.exports = mongoose.model('PreEnrollment', preEnrollmentSchema); 