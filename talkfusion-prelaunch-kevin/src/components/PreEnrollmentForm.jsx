import { useState, useEffect } from 'react';
import { states } from '../data/states';
import { countries } from '../data/countries';
import { packages } from '../data/packages';
import BinaryTreeVisualization from './BinaryTreeVisualization';

const BACKEND_URL = 'http://localhost:5002';

export default function PreEnrollmentForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        package: ''
    });

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamStructure, setTeamStructure] = useState({
        leftLegVolume: 0,
        rightLegVolume: 0,
        placements: []
    });

    // Fetch team structure on component mount
    useEffect(() => {
        fetchTeamStructure();
    }, []);

    const fetchTeamStructure = async () => {
        try {
            console.log('Fetching team structure from:', `${BACKEND_URL}/api/team-structure`);
            const response = await fetch(`${BACKEND_URL}/api/team-structure`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Team structure response:', data);

            if (data.success) {
                setTeamStructure(data.data);
            } else {
                console.error('Team structure fetch failed:', data.message);
            }
        } catch (error) {
            console.error('Error fetching team structure:', error);
            setSubmitStatus({
                type: 'error',
                message: 'Unable to connect to server. Please try again later.'
            });
        }
    };

    const handlePackageChange = (e) => {
        const packageValue = e.target.value;
        setFormData(prev => ({
            ...prev,
            package: packageValue
        }));
        setSelectedPackage(packages.find(p => p.value === packageValue) || null);
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        Object.keys(formData).forEach(key => {
            if (!formData[key]) {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
            }
        });

        // Email validation
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // ZIP/Postal code validation
        if (formData.zipCode) {
            if (formData.country === 'US' && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
                newErrors.zipCode = 'Please enter a valid US ZIP code';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        if (!validateForm()) {
            setSubmitStatus({
                type: 'error',
                message: 'Please correct the errors before submitting.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Submitting form to:', `${BACKEND_URL}/api/pre-enroll`);
            console.log('Form data:', { ...formData, packageDetails: selectedPackage });

            const response = await fetch(`${BACKEND_URL}/api/pre-enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    package: selectedPackage.value,
                    packageDetails: {
                        price: selectedPackage.price,
                        monthlyFee: selectedPackage.monthlyFee,
                        initialSV: selectedPackage.initialSV,
                        monthlySV: selectedPackage.monthlySV,
                        fastStartBonus: selectedPackage.fastStartBonus
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Pre-enroll response:', data);

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: `Pre-enrollment successful! Your Talk Fusion ID is: ${data.data.enrollerId}. You have been placed in the ${data.data.placement.leg} leg at position ${data.data.placement.position}.`
                });

                // Update team structure after successful enrollment
                setTeamStructure(prev => ({
                    leftLegVolume: data.data.teamVolume.leftLeg,
                    rightLegVolume: data.data.teamVolume.rightLeg,
                    placements: [
                        ...prev.placements,
                        {
                            enrollerId: data.data.enrollerId,
                            name: `${formData.firstName} ${formData.lastName}`,
                            leg: data.data.placement.leg,
                            position: data.data.placement.position,
                            initialSV: selectedPackage.initialSV
                        }
                    ]
                }));

                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'US',
                    package: ''
                });
                setSelectedPackage(null);
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.message || 'Failed to submit. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({
                type: 'error',
                message: 'Unable to connect to server. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (name, label, type = 'text', options = null) => {
        const fieldError = errors[name];
        const baseInputClasses = `w-full px-4 py-3 rounded-xl bg-white/10 border ${fieldError ? 'border-red-500' : 'border-purple-400/30'
            } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300`;

        return (
            <div>
                <label htmlFor={name} className="block text-lg font-medium text-white mb-2">
                    {label}
                </label>
                {options ? (
                    <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className={baseInputClasses}
                    >
                        <option value="" className="bg-purple-900">{`Select ${label}`}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value} className="bg-purple-900">
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className={baseInputClasses}
                    />
                )}
                {fieldError && (
                    <p className="mt-2 text-sm text-red-400">{fieldError}</p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mb-12">
                <BinaryTreeVisualization
                    leftLegVolume={teamStructure.leftLegVolume}
                    rightLegVolume={teamStructure.rightLegVolume}
                    placements={teamStructure.placements}
                />
            </div>

            <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-3xl shadow-2xl p-8 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative">
                    <h1 className="text-5xl font-extrabold text-center mb-2 text-white">
                        Magnificent Worldwide Marketing & Sales Group
                    </h1>
                    <h2 className="text-3xl font-bold text-center mb-4 text-purple-200">
                        Join Kevin Gardner's Elite Talk Fusion Pre-Launch Team
                    </h2>
                    <p className="text-xl text-purple-200 mb-8 text-center max-w-3xl mx-auto">
                        Be part of a visionary team focused on leadership, business development, and empowerment.
                        Secure your position as part of the 5th pre-enrollee's team for the April 2025 launch!
                    </p>

                    {submitStatus.message && (
                        <div className={`mb-8 p-6 rounded-xl border ${submitStatus.type === 'success'
                            ? 'bg-green-900/50 border-green-500/30 text-green-100'
                            : 'bg-red-900/50 border-red-500/30 text-red-100'
                            } text-center text-lg`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderField('firstName', 'First Name')}
                            {renderField('lastName', 'Last Name')}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderField('email', 'Email', 'email')}
                            {renderField('phone', 'Phone', 'tel')}
                        </div>

                        {renderField('address', 'Address')}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderField('city', 'City')}
                            {renderField('state', 'State/Province', 'select', states)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderField('zipCode', 'ZIP/Postal Code')}
                            {renderField('country', 'Country', 'select', countries)}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="package" className="block text-xl font-semibold text-white mb-3">
                                    Select Your Package
                                </label>
                                <select
                                    id="package"
                                    name="package"
                                    value={formData.package}
                                    onChange={handlePackageChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${errors.package ? 'border-red-500' : 'border-purple-400/30'
                                        } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300`}
                                >
                                    <option value="" className="bg-purple-900">Select a Package</option>
                                    {packages.map(pkg => (
                                        <option key={pkg.value} value={pkg.value} className="bg-purple-900">
                                            {pkg.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.package && (
                                    <p className="mt-2 text-sm text-red-400">{errors.package}</p>
                                )}
                            </div>

                            {selectedPackage && (
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-purple-400/30">
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Package Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-purple-900/50 p-4 rounded-xl border border-purple-400/30">
                                            <p className="text-purple-200">Initial Investment</p>
                                            <p className="text-2xl font-bold text-white">${selectedPackage.price}</p>
                                        </div>
                                        <div className="bg-purple-900/50 p-4 rounded-xl border border-purple-400/30">
                                            <p className="text-purple-200">Monthly Fee</p>
                                            <p className="text-2xl font-bold text-white">${selectedPackage.monthlyFee}</p>
                                        </div>
                                        <div className="bg-purple-900/50 p-4 rounded-xl border border-purple-400/30">
                                            <p className="text-purple-200">Initial Sales Volume</p>
                                            <p className="text-2xl font-bold text-white">{selectedPackage.initialSV} SV</p>
                                        </div>
                                        <div className="bg-purple-900/50 p-4 rounded-xl border border-purple-400/30">
                                            <p className="text-purple-200">Monthly Sales Volume</p>
                                            <p className="text-2xl font-bold text-white">{selectedPackage.monthlySV} SV</p>
                                        </div>
                                        <div className="bg-green-900/50 p-4 rounded-xl border border-green-400/30 col-span-2">
                                            <p className="text-green-200">Fast Start Bonus Generated</p>
                                            <p className="text-2xl font-bold text-green-100">${selectedPackage.fastStartBonus}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-white mb-3">Package Features:</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedPackage.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-purple-200">
                                                    <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`relative px-8 py-4 text-lg font-semibold rounded-xl text-white overflow-hidden transition-all duration-300
                                    ${isSubmitting
                                        ? 'bg-purple-700/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transform hover:scale-105'
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900`}
                            >
                                <span className="relative z-10">
                                    {isSubmitting ? 'Processing...' : 'Pre-Enroll Now'}
                                </span>
                                {!isSubmitting && (
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 