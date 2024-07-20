global.document = {
  getElementById: jest.fn().mockImplementation((id) => {
    if (id === "tetrisBoard") {
      return {
        style: {},
        appendChild: jest.fn(),
        innerHTML: "",
      };
    }
    if (id === "startButton") {
      return {
        style: { display: "" },
        addEventListener: jest.fn(),
      };
    }
    return null;
  }),
  createElement: jest.fn().mockImplementation((tag) => {
    return {
      style: {},
      classList: {
        add: jest.fn(),
      },
      appendChild: jest.fn(),
      id: "",
    };
  }),
  addEventListener: jest.fn(),
};

global.io = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
});
