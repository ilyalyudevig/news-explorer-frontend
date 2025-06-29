// tests/config/mobile-tablet-config.ts

export interface DeviceTestConfig {
  name: string;
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  features: string[];
}

export const MOBILE_DEVICES: Record<string, DeviceTestConfig> = {
  iPhoneSE: {
    name: "iPhone SE",
    viewport: { width: 375, height: 667 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    features: ["hamburger-menu", "touch-targets", "virtual-keyboard"],
  },
  iPhone12: {
    name: "iPhone 12",
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    features: [
      "hamburger-menu",
      "touch-targets",
      "virtual-keyboard",
      "safe-area",
    ],
  },
  iPhone13Pro: {
    name: "iPhone 13 Pro",
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    features: [
      "hamburger-menu",
      "touch-targets",
      "virtual-keyboard",
      "safe-area",
      "dynamic-island",
    ],
  },
  galaxyS21: {
    name: "Galaxy S21",
    viewport: { width: 360, height: 800 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    features: [
      "hamburger-menu",
      "touch-targets",
      "virtual-keyboard",
      "android-chrome",
    ],
  },
};

export const TABLET_DEVICES: Record<string, DeviceTestConfig> = {
  iPad: {
    name: "iPad",
    viewport: { width: 768, height: 1024 },
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    features: [
      "full-navigation",
      "touch-targets",
      "grid-layout",
      "larger-forms",
    ],
  },
  iPadPro: {
    name: "iPad Pro",
    viewport: { width: 1024, height: 1366 },
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    features: [
      "full-navigation",
      "touch-targets",
      "grid-layout",
      "larger-forms",
      "multitasking",
    ],
  },
  iPadMini: {
    name: "iPad Mini",
    viewport: { width: 744, height: 1133 },
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    features: [
      "full-navigation",
      "touch-targets",
      "compact-tablet",
      "hybrid-layout",
    ],
  },
  galaxyTab: {
    name: "Galaxy Tab S7",
    viewport: { width: 753, height: 1037 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    deviceScaleFactor: 2.25,
    isMobile: false,
    hasTouch: true,
    features: [
      "full-navigation",
      "touch-targets",
      "android-tablet",
      "stylus-support",
    ],
  },
};

export const TEST_SCENARIOS = {
  authentication: {
    name: "Authentication Flow",
    tests: [
      "sign-in-modal-display",
      "sign-up-modal-display",
      "form-validation",
      "keyboard-navigation",
      "touch-interaction",
    ],
  },
  navigation: {
    name: "Navigation Patterns",
    tests: [
      "hamburger-menu-mobile",
      "full-menu-tablet",
      "responsive-transitions",
      "focus-management",
      "accessibility",
    ],
  },
  search: {
    name: "Search Functionality",
    tests: [
      "search-input-behavior",
      "virtual-keyboard-handling",
      "results-layout",
      "infinite-scroll",
      "performance",
    ],
  },
  content: {
    name: "Content Display",
    tests: [
      "article-cards-layout",
      "image-responsiveness",
      "text-readability",
      "bookmark-interaction",
      "sharing-features",
    ],
  },
  performance: {
    name: "Performance Testing",
    tests: [
      "page-load-time",
      "search-response-time",
      "scroll-performance",
      "memory-usage",
      "network-efficiency",
    ],
  },
  accessibility: {
    name: "Accessibility Compliance",
    tests: [
      "keyboard-navigation",
      "screen-reader-compatibility",
      "focus-indicators",
      "color-contrast",
      "touch-target-sizes",
    ],
  },
};

export const PERFORMANCE_BUDGETS = {
  mobile: {
    pageLoadTime: 3000, // 3 seconds
    searchResponseTime: 2000, // 2 seconds
    scrollPerformance: 16, // 60fps (16ms per frame)
    memoryUsage: 50 * 1024 * 1024, // 50MB
  },
  tablet: {
    pageLoadTime: 2500, // 2.5 seconds
    searchResponseTime: 1500, // 1.5 seconds
    scrollPerformance: 16, // 60fps (16ms per frame)
    memoryUsage: 100 * 1024 * 1024, // 100MB
  },
};

export const ACCESSIBILITY_REQUIREMENTS = {
  touchTargetMinSize: 44, // 44x44px minimum for iOS
  colorContrastRatio: 4.5, // WCAG AA standard
  focusIndicatorMinSize: 2, // 2px minimum outline
  textMinSize: 16, // 16px minimum for readable text
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: { min: 320, max: 767 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1025, max: Infinity },
};

export const NETWORK_CONDITIONS = {
  fast3G: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
    uploadThroughput: (750 * 1024) / 8, // 750 Kbps
    latency: 150,
  },
  slow3G: {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // 500 Kbps
    uploadThroughput: (500 * 1024) / 8, // 500 Kbps
    latency: 300,
  },
  offline: {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
};
