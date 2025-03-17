const express = require('express');
const router = express.Router();
const PreEnrollment = require('../models/PreEnrollment');

// Get team structure and volume information
router.get('/team-structure', async (req, res) => {
  try {
    const enrollments = await PreEnrollment.find()
      .select('enrollerId firstName lastName placement packageDetails.initialSV enrollmentDate')
      .sort({ enrollmentDate: 1 });

    // Calculate volume for each leg
    const leftLegVolume = enrollments
      .filter(e => e.placement.leg === 'LEFT')
      .reduce((sum, e) => sum + (e.packageDetails.initialSV || 0), 0);

    const rightLegVolume = enrollments
      .filter(e => e.placement.leg === 'RIGHT')
      .reduce((sum, e) => sum + (e.packageDetails.initialSV || 0), 0);

    const placements = enrollments.map(e => ({
      enrollerId: e.enrollerId,
      name: `${e.firstName} ${e.lastName}`,
      leg: e.placement.leg,
      position: e.placement.position,
      initialSV: e.packageDetails.initialSV,
      enrollmentDate: e.enrollmentDate
    }));

    res.json({
      success: true,
      data: {
        leftLegVolume,
        rightLegVolume,
        placements,
        cyclesAvailable: Math.floor(Math.min(leftLegVolume, rightLegVolume) / 200)
      }
    });
  } catch (error) {
    console.error('Error fetching team structure:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team structure.'
    });
  }
});

router.post('/pre-enroll', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      package: packageType,
      packageDetails
    } = req.body;

    // Check if email already exists
    const existingEnrollment = await PreEnrollment.findOne({ email });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered for pre-enrollment.'
      });
    }

    // Get current leg volumes
    const enrollments = await PreEnrollment.find();
    const leftLegVolume = enrollments
      .filter(e => e.placement.leg === 'LEFT')
      .reduce((sum, e) => sum + (e.packageDetails.initialSV || 0), 0);
    const rightLegVolume = enrollments
      .filter(e => e.placement.leg === 'RIGHT')
      .reduce((sum, e) => sum + (e.packageDetails.initialSV || 0), 0);

    // Determine optimal leg placement (place in leg with less volume)
    const optimalLeg = leftLegVolume <= rightLegVolume ? 'LEFT' : 'RIGHT';

    // Calculate next position in the chosen leg
    const legEnrollments = enrollments.filter(e => e.placement.leg === optimalLeg);
    const nextPosition = legEnrollments.length + 1;

    // Create new pre-enrollment with optimal placement
    const preEnrollment = new PreEnrollment({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      package: packageType,
      packageDetails,
      placement: {
        leg: optimalLeg,
        position: nextPosition
      }
    });

    await preEnrollment.save();

    // Format the enrollment date
    const enrollmentDate = new Date(preEnrollment.enrollmentDate);
    const formattedDate = enrollmentDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    // Get updated leg volumes
    const updatedLeftLegVolume = optimalLeg === 'LEFT' 
      ? leftLegVolume + packageDetails.initialSV 
      : leftLegVolume;
    const updatedRightLegVolume = optimalLeg === 'RIGHT' 
      ? rightLegVolume + packageDetails.initialSV 
      : rightLegVolume;

    res.status(201).json({
      success: true,
      message: 'Pre-enrollment successful!',
      data: {
        enrollerId: preEnrollment.enrollerId,
        enrollmentNumber: preEnrollment.enrollmentNumber,
        enrollmentDate: formattedDate,
        placement: preEnrollment.placement,
        teamVolume: {
          leftLeg: updatedLeftLegVolume,
          rightLeg: updatedRightLegVolume,
          cyclesAvailable: Math.floor(Math.min(updatedLeftLegVolume, updatedRightLegVolume) / 200)
        }
      }
    });
  } catch (error) {
    console.error('Pre-enrollment error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing pre-enrollment. Please try again.'
    });
  }
});

// Get all enrollments (sorted by enrollment date)
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await PreEnrollment.find()
      .select('enrollerId firstName lastName email enrollmentDate enrollmentNumber')
      .sort({ enrollmentDate: 1 });

    res.json({
      success: true,
      data: enrollments.map(enrollment => ({
        ...enrollment.toObject(),
        enrollmentDate: new Date(enrollment.enrollmentDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      }))
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments.'
    });
  }
});

module.exports = router; 