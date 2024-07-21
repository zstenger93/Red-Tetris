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
    if (
      id === "home" ||
      id === "game" ||
      id === "join" ||
      id === "username" ||
      id === "room"
    ) {
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
      return {
        ...commonMock,
        style: {},
        textContent: "",
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
  body: {
    appendChild: jest.fn(),
    innerHTML: "",
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
    hash: "",
  },
  history: {
    pushState: jest.fn(),
  },
  MouseEvent: function (type, options = {}) {
    const event = document.createEvent("MouseEvent");
    event.initMouseEvent(
      type,
      options.bubbles,
      options.cancelable,
      options.view,
      options.detail,
      options.screenX,
      options.screenY,
      options.clientX,
      options.clientY,
      options.ctrlKey,
      options.altKey,
      options.shiftKey,
      options.metaKey,
      options.button,
      options.relatedTarget
    );
    return event;
  },
};

global.KeyboardEvent = class extends Event {
  constructor(type, keyboardEventInit = {}) {
    super(type, keyboardEventInit);
    this.key = keyboardEventInit.key || "";
    this.code = keyboardEventInit.code || "";
    this.altKey = keyboardEventInit.altKey || false;
    this.ctrlKey = keyboardEventInit.ctrlKey || false;
    this.shiftKey = keyboardEventInit.shiftKey || false;
    this.metaKey = keyboardEventInit.metaKey || false;
    this.repeat = keyboardEventInit.repeat || false;
  }
};

global.document.addEventListener = jest.fn((event, callback) => {
  if (event === "keydown" || event === "keyup") {
    global.triggerKeyEvent = (
      type,
      key,
      code,
      altKey = false,
      ctrlKey = false,
      shiftKey = false,
      metaKey = false,
      repeat = false
    ) => {
      const event = new KeyboardEvent(type, {
        key: key,
        code: code,
        altKey: altKey,
        ctrlKey: ctrlKey,
        shiftKey: shiftKey,
        metaKey: metaKey,
        repeat: repeat,
      });
      callback(event);
    };
  } else {
  }
});
