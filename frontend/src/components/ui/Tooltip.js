import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Accessible Tooltip component for providing contextual information
 * 
 * @example
 * // Basic tooltip
 * <Tooltip content="This is a helpful tip">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * // Different positions
 * <Tooltip content="Appears on top" position="top">
 *   <span>Information</span>
 * </Tooltip>
 * 
 * // With HTML content
 * <Tooltip 
 *   content={<div><strong>Note:</strong> Complex content</div>}
 *   position="right"
 * >
 *   <InfoIcon />
 * </Tooltip>
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 300,
  maxWidth = 250,
  className = '',
  ariaLabel,
  offset = 8,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      positionTooltip();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Position the tooltip based on the trigger element's position
  const positionTooltip = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    let x, y;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        y = triggerRect.top - tooltipRect.height - offset + scrollY;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        y = triggerRect.bottom + offset + scrollY;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset + scrollX;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        break;
      case 'right':
        x = triggerRect.right + offset + scrollX;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        break;
      default:
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        y = triggerRect.top - tooltipRect.height - offset + scrollY;
    }

    // Make sure tooltip stays in viewport
    const padding = 10;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setTooltipPosition({ x, y });
  };

  // Handle escape key to close tooltip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  // Clone the child component to add event handlers and ref
  const trigger = React.cloneElement(React.Children.only(children), {
    ref: (node) => {
      triggerRef.current = node;
      // Forward the ref if the child element is using forwardRef
      const originalRef = children.ref;
      if (originalRef) {
        if (typeof originalRef === 'function') {
          originalRef(node);
        } else {
          originalRef.current = node;
        }
      }
    },
    onMouseEnter: (e) => {
      showTooltip();
      // Call the original onMouseEnter if it exists
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e) => {
      hideTooltip();
      // Call the original onMouseLeave if it exists
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e) => {
      showTooltip();
      // Call the original onFocus if it exists
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e) => {
      hideTooltip();
      // Call the original onBlur if it exists
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
    'aria-describedby': isVisible ? 'tooltip' : undefined,
  });

  // Get the portal container
  const getPortalContainer = () => {
    let container = document.getElementById('tooltip-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tooltip-container';
      document.body.appendChild(container);
    }
    return container;
  };

  return (
    <>
      {trigger}
      {isVisible &&
        createPortal(
          <div
            id="tooltip"
            role="tooltip"
            ref={tooltipRef}
            className={`
              fixed z-50 px-3 py-2 text-sm font-medium rounded shadow-md
              bg-background-primary border border-border-light
              text-text-primary
              animate-fade-in
              ${className}
            `}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              maxWidth: maxWidth,
            }}
            aria-label={ariaLabel}
            {...props}
          >
            {content}
            <div 
              className={`absolute w-2 h-2 bg-background-primary border-t border-l border-border-light transform rotate-45 ${
                position === 'top' ? 'bottom-0 -mb-1 left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-0 -mt-1 left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-0 -mr-1 top-1/2 -translate-y-1/2' :
                'left-0 -ml-1 top-1/2 -translate-y-1/2'
              }`}
              aria-hidden="true"
            />
          </div>,
          getPortalContainer()
        )}
    </>
  );
};

Tooltip.propTypes = {
  /** Element that triggers the tooltip */
  children: PropTypes.element.isRequired,
  /** Content to display in the tooltip */
  content: PropTypes.node.isRequired,
  /** Tooltip position relative to trigger */
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Delay before showing tooltip (ms) */
  delay: PropTypes.number,
  /** Maximum width of the tooltip */
  maxWidth: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessible label for the tooltip */
  ariaLabel: PropTypes.string,
  /** Distance between tooltip and trigger (px) */
  offset: PropTypes.number,
};

export default Tooltip;