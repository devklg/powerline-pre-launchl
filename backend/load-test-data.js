require('dotenv').config();
const mongoose = require('mongoose');
const PreEnrollment = require('./models/PreEnrollment');
const testEnrollees = require('./test-data');

// Package definitions
const packages = [
    {
        value: 'STARTER',
        label: 'Starter Package - $297',
        price: 297,
        monthlyFee: 20,
        initialSV: 100,
        monthlySV: 20,
        fastStartBonus: 20,
        features: [
            'Basic Video Suite',
            'Live Meetings (10 participants)',
            'Basic Training Access',
            'Mobile App Access'
        ]
    },
    {
        value: 'ELITE',
        label: 'Elite Package - $897',
        price: 897,
        monthlyFee: 40,
        initialSV: 300,
        monthlySV: 40,
        fastStartBonus: 60,
        features: [
            'Advanced Video Suite',
            'Live Meetings (50 participants)',
            'Premium Training Access',
            'Mobile App Access',
            'Custom Branding',
            'Priority Support'
        ]
    },
    {
        value: 'PRO',
        label: 'Pro Package - $1,497',
        price: 1497,
        monthlyFee: 60,
        initialSV: 500,
        monthlySV: 60,
        fastStartBonus: 100,
        features: [
            'Professional Video Suite',
            'Live Meetings (100 participants)',
            'Elite Training Access',
            'Mobile App Access',
            'Custom Branding',
            'Priority Support',
            'White Label Options',
            'API Access'
        ]
    }
];

async function loadTestData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talk-fusion-pre-launch');
        console.log('Connected to MongoDB');

        // Clear existing data
        await PreEnrollment.deleteMany({});
        console.log('Cleared existing pre-enrollments');

        // Process each enrollee
        for (let i = 0; i < testEnrollees.length; i++) {
            const enrollee = testEnrollees[i];
            const packageDetails = packages.find(p => p.value === enrollee.package);
            
            // Alternate between left and right leg
            const leg = i % 2 === 0 ? 'LEFT' : 'RIGHT';
            const position = Math.floor(i / 2) + 1;
            
            const preEnrollment = new PreEnrollment({
                ...enrollee,
                packageDetails: {
                    price: packageDetails.price,
                    monthlyFee: packageDetails.monthlyFee,
                    initialSV: packageDetails.initialSV,
                    monthlySV: packageDetails.monthlySV,
                    fastStartBonus: packageDetails.fastStartBonus
                },
                placement: {
                    leg,
                    position
                }
            });

            await preEnrollment.save();
            console.log(`Added ${enrollee.firstName} ${enrollee.lastName} to ${leg} leg at position ${position}`);
        }

        console.log('Test data loaded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error loading test data:', error);
        process.exit(1);
    }
}

loadTestData(); 