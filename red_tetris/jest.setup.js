global.document = {
  getElementById: jest.fn().mockImplementation((id) => {
    const commonMock = {
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    };

    if (id === "tetrisBoard") {
      return {
        ...commonMock,
        style: {},
        appendChild: jest.fn(),
        innerHTML: "",
      };
    }
    if (id === "startButton") {
      return {
        ...commonMock,
        style: { display: "" },
        addEventListener: jest.fn(),
      };
    }
    if (id === "home" || id === "game" || id === "join" || id === "username" || id === "room") {
      if (id === "join") {
        return {
          ...commonMock,
          addEventListener: jest.fn((event, handler) => {
            if (event === "click") {
              global.joinButtonHandler = handler;
            }
          }),
          click: jest.fn(() => {
            if (global.joinButtonHandler) {
              global.joinButtonHandler();
            }
          }),
        };
      }
      if (id === "username" || id === "room") {
        return {
          ...commonMock,
          value: "test",
        };
      }
      return commonMock;
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
  body: {
    appendChild: jest.fn(),
    innerHTML: '',
  },
  dispatchEvent: jest.fn(),
};

global.io = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
});

global.window = {
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  location: {
    hash: '',
  },
  history: {
    pushState: jest.fn(),
  },
};