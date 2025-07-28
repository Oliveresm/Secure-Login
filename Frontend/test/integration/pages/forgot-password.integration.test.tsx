import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import ForgotPassword from "../../../src/modules/public/ForgotPassword/ForgotPassword";

// ───────────────────────────────────────────────────────────────────────────────
// Double for the toast API (sonner)
// ───────────────────────────────────────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
import { toast } from "sonner";

// ───────────────────────────────────────────────────────────────────────────────
// Mock for the custom hook
// ───────────────────────────────────────────────────────────────────────────────
import * as useForgotPasswordHook from "../../../src/modules/public/ForgotPassword/hooks/useForgotPassword";
const sendLinkMock = vi.fn();

// Helper that returns a deterministic hook implementation
const makeHook =
  (overrides: Partial<ReturnType<typeof useForgotPasswordHook.default>> = {}) =>
  () => ({
    sendLink: sendLinkMock,
    loading: false,
    error: null,
    success: false,
    ...overrides,
  });

// Convenience wrapper to give React Router context
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  sendLinkMock.mockReset();
});

describe("ForgotPassword page", () => {
  it("shows a toast if the email field is empty", async () => {
    vi.spyOn(useForgotPasswordHook, "default").mockImplementation(makeHook());

    renderWithRouter(<ForgotPassword />);

    // Disable native validation so <form> always triggers onSubmit
    const form = document.querySelector("form") as HTMLFormElement;
    form.noValidate = true;

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Please enter your email.")
    );
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("shows a toast for an invalid email format", async () => {
    vi.spyOn(useForgotPasswordHook, "default").mockImplementation(makeHook());

    renderWithRouter(<ForgotPassword />);

    // Disable native validation again
    const form = document.querySelector("form") as HTMLFormElement;
    form.noValidate = true;

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter a valid email address."
      )
    );
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("calls sendLink with a valid email", async () => {
    vi.spyOn(useForgotPasswordHook, "default").mockImplementation(makeHook());

    renderWithRouter(<ForgotPassword />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(sendLinkMock).toHaveBeenCalledWith({ email: "user@example.com" })
    );
  });

  it("renders the success message when the hook reports success", () => {
    vi.spyOn(useForgotPasswordHook, "default").mockImplementation(
      makeHook({ success: true })
    );

    renderWithRouter(<ForgotPassword />);

    expect(
      screen.getByText(/we’ve sent you a reset link/i)
    ).toBeInTheDocument();
  });

  it("disables the input and button while loading", () => {
    vi.spyOn(useForgotPasswordHook, "default").mockImplementation(
      makeHook({ loading: true })
    );

    renderWithRouter(<ForgotPassword />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
  });
});
