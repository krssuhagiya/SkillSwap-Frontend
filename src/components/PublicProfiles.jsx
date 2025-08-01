import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, User, MapPin, Mail, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import UserProfileService from "../services/userProfile.service";

// Constants
const PROFILES_PER_PAGE = 6;
const SEARCH_DEBOUNCE_DELAY = 500;
const MAX_DESCRIPTION_LENGTH = 120;

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Profile Card Component
const ProfileCard = React.memo(({ profile }) => {
  const truncatedAbout = useMemo(() => {
    if (!profile.aboutMe) return 'No description available';
    return profile.aboutMe.length > MAX_DESCRIPTION_LENGTH 
      ? `${profile.aboutMe.slice(0, MAX_DESCRIPTION_LENGTH)}...`
      : profile.aboutMe;
  }, [profile.aboutMe]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {profile.fullname || 'Unknown User'}
          </h3>
          
          {profile.headline && (
            <p className="text-sm text-blue-600 font-medium mt-1 line-clamp-2">
              {profile.headline}
            </p>
          )}
          
          {profile.location && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-4 leading-relaxed">
        {truncatedAbout}
      </p>
      
      {profile.userId?.email && (
        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-500 truncate">
            {profile.userId.email}
          </span>
        </div>
      )}
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

// Loading Skeleton Component
const ProfileCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Empty State Component
const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {searchTerm ? 'No profiles found' : 'No profiles available'}
    </h3>
    <p className="text-gray-600">
      {searchTerm 
        ? `We couldn't find any profiles matching "${searchTerm}". Try adjusting your search terms.`
        : 'There are no public profiles to display at the moment.'
      }
    </p>
  </div>
);

// Pagination Component
const Pagination = ({ pagination, currentPage, onPageChange, isLoading }) => {
  if (!pagination.totalPages || pagination.totalPages <= 1) return null;

  const pages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pagination.totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else if (pagination.totalPages > 1) {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots;
  }, [currentPage, pagination.totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {pagination.totalPages}
        {pagination.total && (
          <span className="ml-1">({pagination.total} total profiles)</span>
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev || isLoading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        <div className="hidden sm:flex">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...' || isLoading}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : page === '...'
                  ? 'bg-white text-gray-400 border-gray-300 cursor-default'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext || isLoading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const PublicProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

  const fetchProfiles = useCallback(async (pageNum = page, searchTerm = debouncedSearch) => {
    try {
      const isNewSearch = searchTerm !== debouncedSearch;
      
      if (isNewSearch) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);

      const response = await UserProfileService.getPublicProfiles(
        pageNum, 
        PROFILES_PER_PAGE, 
        searchTerm
      );

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format');
      }

      setProfiles(Array.isArray(response.data) ? response.data : []);
      setPagination(response.pagination || {});
      
    } catch (err) {
      console.error('Error fetching public profiles:', err);
      setError(err.message || 'Failed to load profiles. Please try again.');
      setProfiles([]);
      setPagination({});
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setPage(1); // Reset to first page on new search
    }
  }, [debouncedSearch, search]);

  useEffect(() => {
    fetchProfiles(page, debouncedSearch);
  }, [fetchProfiles, page, debouncedSearch]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !isLoading) {
      setPage(newPage);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.totalPages, isLoading]);

  const handleRetry = useCallback(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const isFirstLoad = isLoading && profiles.length === 0 && !error;
  const showSkeletons = isFirstLoad;
  const showProfiles = !isLoading && !error && profiles.length > 0;
  const showEmpty = !isLoading && !error && profiles.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Profiles</h1>
          <p className="text-gray-600">Discover and connect with professionals in your network</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, headline, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Content */}
        {error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : showEmpty ? (
          <EmptyState searchTerm={debouncedSearch} />
        ) : (
          <>
            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {showSkeletons
                ? Array.from({ length: PROFILES_PER_PAGE }).map((_, index) => (
                    <ProfileCardSkeleton key={index} />
                  ))
                : showProfiles &&
                  profiles.map((profile) => (
                    <ProfileCard key={profile._id} profile={profile} />
                  ))
              }
            </div>

            {/* Pagination */}
            {(showProfiles || isLoading) && (
              <Pagination
                pagination={pagination}
                currentPage={page}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfiles;