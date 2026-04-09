import React from "react";
import renderer, { act } from "react-test-renderer";
import Login from "@/app/(auth)/login";
import loginService from "@/services/authLogin";
import { useSession } from "@/services/session";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/authLogin", () => jest.fn());
jest.mock("@/services/session", () => ({
  useSession: jest.fn(),
}));

function createTree() {
  let tree: any;

  act(() => {
    tree = renderer.create(<Login />);
  });

  return tree;
}

describe("Login screen", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const signIn = jest.fn();
  const continueAsGuest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push, replace });
    (useSession as jest.Mock).mockReturnValue({ signIn, continueAsGuest });
  });

  it("updates both inputs when the user types", () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "login-email-input" }).props.onChangeText("user@test.local");
      tree.root.findByProps({ testID: "login-password-input" }).props.onChangeText("secret123");
    });

    expect(tree.root.findByProps({ testID: "login-email-input" }).props.value).toBe("user@test.local");
    expect(tree.root.findByProps({ testID: "login-password-input" }).props.value).toBe("secret123");
  });

  it("signs in and redirects through the index route", async () => {
    (loginService as jest.Mock).mockResolvedValue({
      mode: "authenticated",
      token: "token-123",
      user: { id: 1, email: "user@test.local", username: "user" },
    });

    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "login-email-input" }).props.onChangeText("user@test.local");
      tree.root.findByProps({ testID: "login-password-input" }).props.onChangeText("secret123");
    });

    await act(async () => {
      tree.root.findByProps({ testID: "login-submit-button" }).props.onPress();
    });

    expect(loginService).toHaveBeenCalledWith("user@test.local", "secret123");
    expect(signIn).toHaveBeenCalledWith({
      mode: "authenticated",
      token: "token-123",
      user: { id: 1, email: "user@test.local", username: "user" },
    });
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("enters guest mode and redirects through the index route", async () => {
    continueAsGuest.mockResolvedValue(undefined);

    const tree = createTree();

    await act(async () => {
      tree.root.findByProps({ testID: "login-guest-link" }).props.onPress();
    });

    expect(continueAsGuest).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("sends both the back arrow and logo to the landing page", () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "login-back-button" }).props.onPress();
      tree.root.findByProps({ testID: "login-logo-button" }).props.onPress();
    });

    expect(replace).toHaveBeenCalledWith("/landing-page");
  });
});
