// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock framer-motion to avoid animation issues in tests
/* eslint-disable react/prop-types */
jest.mock("framer-motion", () => {
  const React = require("react");

  const createMotionComponent = (Component) => {
    return React.forwardRef(({ children, ...props }, ref) => {
      // Remove motion-specific props that might cause issues
      const {
        initial,
        animate,
        exit,
        transition,
        whileHover,
        whileTap,
        whileInView,
        variants,
        layoutId,
        ...domProps
      } = props;

      return React.createElement(Component, { ...domProps, ref }, children);
    });
  };

  return {
    motion: {
      div: createMotionComponent("div"),
      section: createMotionComponent("section"),
      h1: createMotionComponent("h1"),
      h2: createMotionComponent("h2"),
      h3: createMotionComponent("h3"),
      p: createMotionComponent("p"),
      button: createMotionComponent("button"),
      form: createMotionComponent("form"),
      input: createMotionComponent("input"),
      textarea: createMotionComponent("textarea"),
      img: createMotionComponent("img"),
      a: createMotionComponent("a"),
      span: createMotionComponent("span"),
      article: createMotionComponent("article"),
      header: createMotionComponent("header"),
      footer: createMotionComponent("footer"),
      nav: createMotionComponent("nav"),
      ul: createMotionComponent("ul"),
      li: createMotionComponent("li"),
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => [React.createRef(), true],
  };
});
/* eslint-enable react/prop-types */

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
  useInView: () => [null, true, {}],
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

// Mock axios for API calls
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  })),
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));
