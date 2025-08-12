import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, Calendar, Check } from 'lucide-react';
import UserProfileService from '../services/userProfile.service';
import { useNavigate } from 'react-router';
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        fullname: "",
        headline: "",
        aboutMe: "",
        location: "",
        publicEmail: "",
        phone: "",
        linkedinUrl: "",
        experience: [],
        education: [],
        availability: [],
        isProfilePublic: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const totalSteps = 4;

    const steps = [
        { number: 1, title: "Personal Info", icon: User },
        { number: 2, title: "Experience", icon: Briefcase },
        { number: 3, title: "Education", icon: GraduationCap },
        { number: 4, title: "Availability", icon: Calendar },
    ];

    // Experience handlers
    const handleExperienceChange = (idx, e) => {
        const newExp = [...form.experience];
        newExp[idx][e.target.name] = e.target.value;
        setForm({ ...form, experience: newExp });
    };

    const addExperience = () => {
        setForm({
            ...form,
            experience: [...form.experience, {
                title: "",
                company: "",
                startDate: "",
                endDate: "",
                description: ""
            }]
        });
    };

    const removeExperience = (idx) => {
        const newExp = [...form.experience];
        newExp.splice(idx, 1);
        setForm({ ...form, experience: newExp });
    };

    // Education handlers
    const handleEducationChange = (idx, e) => {
        const newEdu = [...form.education];
        newEdu[idx][e.target.name] = e.target.value;
        setForm({ ...form, education: newEdu });
    };

    const addEducation = () => {
        setForm({
            ...form,
            education: [...form.education, {
                institution: "",
                degree: "",
                startYear: "",
                endYear: ""
            }]
        });
    };

    const removeEducation = (idx) => {
        const newEdu = [...form.education];
        newEdu.splice(idx, 1);
        setForm({ ...form, education: newEdu });
    };

    // Main form handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            // Simulate API call
            await UserProfileService.createProfile({ ...form, userId: user._id || user.id });
            setSuccess("Profile completed successfully!");
            setTimeout(() => {
                // navigate("/"); // Uncomment when using with router
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to complete profile.");
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepValid = (step) => {
        switch (step) {
            case 1:
                return form.fullname.trim() !== "";
            case 2:
                return true; // Experience is optional
            case 3:
                return true; // Education is optional
            case 4:
                return true; // Availability is optional
            default:
                return true;
        }
    };

    const AVAILABILITY_OPTIONS = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter your full name"
                                    value={form.fullname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Headline
                                </label>
                                <input
                                    type="text"
                                    name="headline"
                                    placeholder="e.g., Senior Software Engineer"
                                    value={form.headline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="City, Country"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Public Email
                                </label>
                                <input
                                    type="email"
                                    name="publicEmail"
                                    placeholder="your.email@example.com"
                                    value={form.publicEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="+1 (555) 123-4567"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="text"
                                    name="linkedinUrl"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    value={form.linkedinUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About Me
                            </label>
                            <textarea
                                name="aboutMe"
                                placeholder="Tell us about yourself, your interests, and what makes you unique..."
                                value={form.aboutMe}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center mt-6">
                            <label htmlFor="isProfilePublic" className="mr-4 text-sm font-medium text-gray-700">
                                Set Public Profile
                            </label>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, isProfilePublic: !form.isProfilePublic })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none 
            ${form.isProfilePublic ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                ${form.isProfilePublic ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                            <span className="ml-3 text-sm text-gray-600">
                                {form.isProfilePublic ? 'Public' : 'Private'}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            When enabled, your profile will be visible to others.
                        </p>

                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Add Experience
                            </button>
                        </div>

                        {form.experience.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600">No work experience added yet</p>
                                <p className="text-gray-500 text-sm">Click "Add Experience" to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {form.experience.map((exp, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Experience {idx + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeExperience(idx)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    placeholder="e.g., Software Engineer"
                                                    value={exp.title}
                                                    onChange={e => handleExperienceChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    placeholder="e.g., Tech Corp"
                                                    value={exp.company}
                                                    onChange={e => handleExperienceChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={exp.startDate}
                                                    onChange={e => handleExperienceChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={exp.endDate}
                                                    onChange={e => handleExperienceChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                placeholder="Describe your role, responsibilities, and achievements..."
                                                value={exp.description}
                                                onChange={e => handleExperienceChange(idx, e)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Add Education
                            </button>
                        </div>

                        {form.education.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600">No education records added yet</p>
                                <p className="text-gray-500 text-sm">Click "Add Education" to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {form.education.map((edu, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Education {idx + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(idx)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                                <input
                                                    type="text"
                                                    name="institution"
                                                    placeholder="e.g., University of Technology"
                                                    value={edu.institution}
                                                    onChange={e => handleEducationChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                                <input
                                                    type="text"
                                                    name="degree"
                                                    placeholder="e.g., Bachelor of Computer Science"
                                                    value={edu.degree}
                                                    onChange={e => handleEducationChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                                                <input
                                                    type="number"
                                                    name="startYear"
                                                    placeholder="e.g., 2018"
                                                    value={edu.startYear}
                                                    onChange={e => handleEducationChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                                                <input
                                                    type="number"
                                                    name="endYear"
                                                    placeholder="e.g., 2022"
                                                    value={edu.endYear}
                                                    onChange={e => handleEducationChange(idx, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Availability</h2>
                        <p className="text-gray-600">Select the days you're available for work or meetings</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {AVAILABILITY_OPTIONS.map(option => (
                                <label key={option} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={form.availability.includes(option)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setForm({ ...form, availability: [...form.availability, option] });
                                            } else {
                                                setForm({ ...form, availability: form.availability.filter(a => a !== option) });
                                            }
                                        }}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>

                        {form.availability.length > 0 && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Selected Days:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {form.availability.map(day => (
                                        <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
                        <div className="text-sm text-gray-500">
                            Step {currentStep} of {totalSteps}
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.number;
                            const isCurrent = currentStep === step.number;

                            return (
                                <div key={step.number} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isCurrent
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {isCompleted ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="ml-3 hidden sm:block">
                                        <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div onSubmit={handleSubmit}>
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium ${currentStep === 1
                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Previous
                            </button>

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid(currentStep)}
                                    className={`flex items-center px-6 py-3 rounded-lg font-medium ${isStepValid(currentStep)
                                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Complete Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{success}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;