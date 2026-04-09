import React from "react";
import renderer, { act } from "react-test-renderer";
import Register from "@/app/(auth)/register";
import registerUser from "@/services/authRegister";
import { useSession } from "@/services/session";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/authRegister", () => jest.fn());
jest.mock("@/services/session", () => ({
  useSession: jest.fn(),
}));

function createTree() {
  let tree: any;

  act(() => {
    tree = renderer.create(<Register />);
  });

  return tree;
}

describe("Register screen", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const continueAsGuest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push, replace });
    (useSession as jest.Mock).mockReturnValue({ continueAsGuest });
  });

  it("updates all fields when the user types", () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "register-username-input" }).props.onChangeText("tester");
      tree.root.findByProps({ testID: "register-email-input" }).props.onChangeText("tester@test.local");
      tree.root.findByProps({ testID: "register-password-input" }).props.onChangeText("secret123");
      tree.root.findByProps({ testID: "register-confirm-password-input" }).props.onChangeText("secret123");
    });

    expect(tree.root.findByProps({ testID: "register-username-input" }).props.value).toBe("tester");
    expect(tree.root.findByProps({ testID: "register-email-input" }).props.value).toBe("tester@test.local");
    expect(tree.root.findByProps({ testID: "register-password-input" }).props.value).toBe("secret123");
    expect(tree.root.findByProps({ testID: "register-confirm-password-input" }).props.value).toBe("secret123");
  });

  it("validates mismatched passwords before submitting", async () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "register-username-input" }).props.onChangeText("tester");
      tree.root.findByProps({ testID: "register-email-input" }).props.onChangeText("tester@test.local");
      tree.root.findByProps({ testID: "register-password-input" }).props.onChangeText("secret123");
      tree.root.findByProps({ testID: "register-confirm-password-input" }).props.onChangeText("secret456");
    });

    await act(async () => {
      tree.root.findByProps({ testID: "register-submit-button" }).props.onPress();
    });

    expect(registerUser).not.toHaveBeenCalled();
    expect(tree.root.findByProps({ children: "Passwords do not match." })).toBeTruthy();
  });

  it("registers and redirects to login", async () => {
    (registerUser as jest.Mock).mockResolvedValue(undefined);

    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "register-username-input" }).props.onChangeText("tester");
      tree.root.findByProps({ testID: "register-email-input" }).props.onChangeText("tester@test.local");
      tree.root.findByProps({ testID: "register-password-input" }).props.onChangeText("secret123");
      tree.root.findByProps({ testID: "register-confirm-password-input" }).props.onChangeText("secret123");
    });

    await act(async () => {
      tree.root.findByProps({ testID: "register-submit-button" }).props.onPress();
    });

    expect(registerUser).toHaveBeenCalledWith({
      username: "tester",
      email: "tester@test.local",
      password: "secret123",
    });
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("enters guest mode and redirects through the index route", async () => {
    continueAsGuest.mockResolvedValue(undefined);

    const tree = createTree();

    await act(async () => {
      tree.root.findByProps({ testID: "register-guest-link" }).props.onPress();
    });

    expect(continueAsGuest).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("sends both the back arrow and logo to the landing page", () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "register-back-button" }).props.onPress();
      tree.root.findByProps({ testID: "register-logo-button" }).props.onPress();
    });

    expect(replace).toHaveBeenCalledWith("/landing-page");
  });
});
