import React from 'react';
import PropTypes from 'prop-types';

/**
 * SkipLink provides keyboard users a way to skip to the main content
 * A crucial accessibility feature for keyboard navigation
 */
const SkipLink = ({ mainContentId = 'main-content' }) => {
  return (
    <a 
      href={`#${mainContentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 
                focus:px-4 focus:py-2 focus:bg-brand-emerald focus:text-white focus:rounded-md"
    >
      Skip to main content
    </a>
  );
};

SkipLink.propTypes = {
  mainContentId: PropTypes.string
};

export default SkipLink;