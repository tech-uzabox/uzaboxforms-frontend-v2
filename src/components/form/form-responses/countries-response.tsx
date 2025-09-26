import React from 'react';

interface CountriesResponseProps {
  response: string;
  label: string;
}

const CountriesResponse: React.FC<CountriesResponseProps> = ({ response }) => {
  // Convert the response from lowercase to proper case for display
  const formatCountryName = (countryCode: string): string => {
    if (!countryCode) return '';
    
    // Split by spaces and capitalize each word
    return countryCode
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="main-response-container">
      {formatCountryName(response)}
    </div>
  );
};

export default CountriesResponse;
