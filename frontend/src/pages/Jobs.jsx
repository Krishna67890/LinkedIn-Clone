import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaBuilding, 
  FaClock,
  FaDollarSign,
  FaStar,
  FaBookmark,
  FaShare,
  FaEye,
  FaFilter,
  FaTimes
} from 'react-icons/fa';

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    experience: "Senior",
    posted: "2 days ago",
    description: "We're looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using modern technologies like React, TypeScript, and Next.js.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    remote: true,
    featured: true,
    applications: 24,
    views: 156,
    bookmarked: false
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    experience: "Mid-level",
    posted: "1 week ago",
    description: "Join our dynamic team as a Full Stack Engineer. Work on both frontend and backend technologies to build scalable web applications.",
    skills: ["Node.js", "React", "MongoDB", "AWS"],
    remote: true,
    featured: false,
    applications: 18,
    views: 89,
    bookmarked: true
  },
  {
    id: 3,
    title: "React Native Developer",
    company: "MobileFirst",
    location: "Austin, TX",
    type: "Contract",
    salary: "$90,000 - $110,000",
    experience: "Mid-level",
    posted: "3 days ago",
    description: "Looking for a React Native developer to build cross-platform mobile applications for iOS and Android.",
    skills: ["React Native", "JavaScript", "iOS", "Android"],
    remote: false,
    featured: true,
    applications: 12,
    views: 67,
    bookmarked: false
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Part-time",
    salary: "$80,000 - $100,000",
    experience: "Junior",
    posted: "5 days ago",
    description: "Creative UI/UX designer needed for exciting projects. You'll work on user research, wireframing, and prototyping.",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    remote: true,
    featured: false,
    applications: 8,
    views: 45,
    bookmarked: false
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "CloudSystems",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    experience: "Senior",
    posted: "1 day ago",
    description: "Senior backend developer needed to build scalable APIs and microservices using Node.js and Python.",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker"],
    remote: true,
    featured: true,
    applications: 32,
    views: 198,
    bookmarked: false
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    experience: "Senior",
    posted: "4 days ago",
    description: "DevOps engineer to manage cloud infrastructure and CI/CD pipelines. Experience with AWS and Kubernetes required.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
    remote: false,
    featured: false,
    applications: 15,
    views: 78,
    bookmarked: false
  }
];

const Jobs = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    experience: '',
    remote: false,
    featured: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skills.some(skill => 
                            skill.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      
      const matchesLocation = !filters.location || 
                            job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || job.type === filters.type;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesRemote = !filters.remote || job.remote;
      const matchesFeatured = !filters.featured || job.featured;

      return matchesSearch && matchesLocation && matchesType && 
             matchesExperience && matchesRemote && matchesFeatured;
    });
  }, [jobs, searchTerm, filters]);

  // Sort jobs
  const sortedJobs = useMemo(() => {
    const jobsToSort = [...filteredJobs];
    
    switch (sortBy) {
      case 'newest':
        return jobsToSort.sort((a, b) => new Date(b.posted) - new Date(a.posted));
      case 'salary':
        return jobsToSort.sort((a, b) => {
          const getSalary = (salary) => parseInt(salary.replace(/[^0-9]/g, ''));
          return getSalary(b.salary) - getSalary(a.salary);
        });
      case 'applications':
        return jobsToSort.sort((a, b) => b.applications - a.applications);
      default:
        return jobsToSort;
    }
  }, [filteredJobs, sortBy]);

  // Toggle bookmark
  const toggleBookmark = useCallback((jobId) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, bookmarked: !job.bookmarked } : job
      )
    );
  }, []);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: '',
      type: '',
      experience: '',
      remote: false,
      featured: false
    });
    setSearchTerm('');
  };

  // Job card component
  const JobCard = ({ job }) => (
    <div className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300 ${
      job.featured ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                {job.title}
              </h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleBookmark(job.id)}
              className={`p-2 rounded-full transition-colors ${
                job.bookmarked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <FaBookmark size={16} style={{ fill: job.bookmarked ? 'currentColor' : 'none' }} />
            </button>
            <button className="p-2 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-colors">
              <FaShare size={16} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <FaStar size={12} className="mr-1" />
              Featured
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {job.type}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {job.experience}
          </span>
          {job.remote && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Remote
            </span>
          )}
        </div>

        {/* Job details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <FaMapMarkerAlt size={16} className="mr-2" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaDollarSign size={16} className="mr-2" />
            {job.salary}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaClock size={16} className="mr-2" />
            {job.posted}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center">
            <FaEye size={14} className="mr-1" />
            {job.views} views
          </div>
          <div>
            {job.applications} applicants
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Apply Now
          </button>
          <button 
            onClick={() => setSelectedJob(job)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // Job list item component
  const JobListItem = ({ job }) => (
    <div className={`bg-white p-6 border-b hover:bg-gray-50 transition-colors ${
      job.featured ? 'border-l-4 border-l-blue-500' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <FaDollarSign size={14} className="mr-1" />
              {job.salary}
            </span>
            <span>{job.type}</span>
            <span>{job.experience}</span>
            {job.remote && <span className="text-green-600">Remote</span>}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => toggleBookmark(job.id)}
              className={`p-2 rounded-full transition-colors ${
                job.bookmarked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <FaBookmark size={16} style={{ fill: job.bookmarked ? 'currentColor' : 'none' }} />
            </button>
          </div>
          <span className="text-xs text-gray-500">{job.posted}</span>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
              <p className="text-gray-600 mt-2">
                Discover {jobs.length} opportunities waiting for you
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {view === 'grid' ? 'List View' : 'Grid View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title, company, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City, state, or remote..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => handleFilterChange('remote', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Jobs</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {sortedJobs.length} Jobs Found
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {searchTerm || Object.values(filters).some(f => f) 
                      ? 'Based on your search criteria' 
                      : 'All available jobs'
                    }
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="salary">Highest Salary</option>
                    <option value="applications">Most Applications</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FaFilter size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more jobs.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {sortedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                {sortedJobs.map(job => (
                  <JobListItem key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-xl text-gray-600 mt-1">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{selectedJob.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt size={20} className="mr-3" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaDollarSign size={20} className="mr-3" />
                    {selectedJob.salary}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock size={20} className="mr-3" />
                    {selectedJob.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBuilding size={20} className="mr-3" />
                    {selectedJob.experience} Level
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-6">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Apply Now
                  </button>
                  <button 
                    onClick={() => toggleBookmark(selectedJob.id)}
                    className={`px-6 py-3 border rounded-lg transition-colors ${
                      selectedJob.bookmarked
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FaBookmark 
                      size={20} 
                      style={{ fill: selectedJob.bookmarked ? 'currentColor' : 'none' }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;