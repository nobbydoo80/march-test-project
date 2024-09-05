import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewPostPage from "../page";
import { useHttpClient } from "../../hook/useHttpClient";
import { useRouter } from "next/navigation";

jest.mock("../../hook/useHttpClient", () => ({
  useHttpClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("NewPostPage Component", () => {
  const mockSendRequest = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    global.alert = jest.fn();
    (useHttpClient as jest.Mock).mockReturnValue({
      sendRequest: mockSendRequest,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form with title and body inputs and a submit button", () => {
    render(<NewPostPage />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create post/i })
    ).toBeInTheDocument();
  });

  it("should allow typing in the title and body inputs", () => {
    render(<NewPostPage />);

    const titleInput = screen.getByPlaceholderText(/enter post title/i);
    const bodyInput = screen.getByPlaceholderText(/enter post body/i);

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(bodyInput, { target: { value: "Test Body" } });

    expect(titleInput).toHaveValue("Test Title");
    expect(bodyInput).toHaveValue("Test Body");
  });

  it("should submit the form and create a new post", async () => {
    mockSendRequest.mockResolvedValueOnce({});

    render(<NewPostPage />);

    const titleInput = screen.getByPlaceholderText(/enter post title/i);
    const bodyInput = screen.getByPlaceholderText(/enter post body/i);
    const submitButton = screen.getByRole("button", { name: /create post/i });

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(bodyInput, { target: { value: "Test Body" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalledWith(
        `${process.env.API_URL}/posts`,
        "POST",
        JSON.stringify({
          title: "Test Title",
          body: "Test Body",
          userId: 1,
        })
      );

      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("should not submit the form if required fields are missing", async () => {
    render(<NewPostPage />);

    const submitButton = screen.getByRole("button", { name: /create post/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSendRequest).not.toHaveBeenCalled();
    });
  });
});
