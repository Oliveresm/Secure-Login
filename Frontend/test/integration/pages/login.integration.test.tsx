import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";


const mockLogin = vi.fn().mockImplementation(() => {
  toast.success('Logged in!');  
  mockNavigate('/chat');  
});
vi.mock("../../../src/modules/public/Login/hooks/useLogin", async () => {
  const actual = await vi.importActual<object>(
    "../../../src/modules/public/Login/hooks/useLogin"
  );
  return {
    ...actual,
    default: () => ({
      login: mockLogin,
      loading: false,
      genericError: null,
      fieldErrors: {},
    }),
  };
});


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<object>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


import Login from "../../../src/modules/public/Login/Login";
import { toast } from "sonner";

describe("Login integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía credenciales, muestra toast y redirige al dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<div>Chat page</div>} />
        </Routes>
      </MemoryRouter>
    );


    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {

      expect(mockLogin).toHaveBeenCalledWith(
        "john@example.com",
        "Password123!"
      );


      expect(toast.success).toHaveBeenCalledWith("Logged in!");

      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    });
  });
});
