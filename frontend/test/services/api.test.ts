describe("API_URL", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("keeps localhost for web", () => {
    jest.doMock("expo-secure-store", () => ({
      getItemAsync: jest.fn(),
      setItemAsync: jest.fn(),
      deleteItemAsync: jest.fn(),
    }));
    jest.doMock("react-native", () => ({
      Platform: { OS: "web" },
    }));
    jest.doMock("expo-constants", () => ({
      expoConfig: { hostUri: "192.168.1.50:8081" },
    }));

    const api = require("@/services/api");

    expect(api.API_URL).toBe("http://localhost:3000");
    expect(api.createApiHeaders()).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("rewrites localhost to the expo dev host on native", () => {
    jest.doMock("expo-secure-store", () => ({
      getItemAsync: jest.fn(),
      setItemAsync: jest.fn(),
      deleteItemAsync: jest.fn(),
    }));
    jest.doMock("react-native", () => ({
      Platform: { OS: "android" },
    }));
    jest.doMock("expo-constants", () => ({
      expoConfig: { hostUri: "192.168.1.50:8081" },
    }));

    const api = require("@/services/api");

    expect(api.API_URL).toBe("http://192.168.1.50:3000");
    expect(api.createApiHeaders()).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("adds the ngrok header only for ngrok urls", () => {
    jest.doMock("expo-secure-store", () => ({
      getItemAsync: jest.fn(),
      setItemAsync: jest.fn(),
      deleteItemAsync: jest.fn(),
    }));
    jest.doMock("react-native", () => ({
      Platform: { OS: "web" },
    }));
    jest.doMock("@/app/config.json", () => ({
      API_URL: "https://example.ngrok-free.dev",
    }), { virtual: true });
    jest.doMock("expo-constants", () => ({
      expoConfig: { hostUri: "192.168.1.50:8081" },
    }));

    const api = require("@/services/api");

    expect(api.createApiHeaders()).toEqual({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69",
    });
  });
});
