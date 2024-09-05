import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostPage from "../../[id]/page";
import { useHttpClient } from "../../hook/useHttpClient";
import { useRouter } from "next/navigation";

jest.mock("../../hook/useHttpClient", () => ({
  useHttpClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

process.env.API_URL = "http://localhost:3000";

describe("PostPage Component", () => {
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

  const mockData = { title: "Test Title", body: "Test Body" };
  mockSendRequest.mockResolvedValueOnce(mockData);

  it("should fetch and display the post data", async () => {
    mockSendRequest.mockResolvedValueOnce({
      title: "Test Title",
      body: "Test Body",
    });

    await act(async () => {
      render(<PostPage params={{ id: "1" }} />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Body")).toBeInTheDocument();
    });
  });

  it("should update the post when form is submitted", async () => {
    mockSendRequest
      .mockResolvedValueOnce({ title: "Test Title", body: "Test Body" })
      .mockResolvedValueOnce({});

    await act(async () => {
      render(<PostPage params={{ id: "1" }} />);
    });

    const titleInput = await screen.findByDisplayValue("Test Title");
    const bodyInput = screen.getByText("Test Body");
    const updateButton = screen.getByRole("button", { name: /update post/i });

    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.change(bodyInput, { target: { value: "Updated Body" } });

    fireEvent.submit(updateButton);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalledWith(
        `${process.env.API_URL}/posts/1`,
        "PUT",
        JSON.stringify({
          title: "Updated Title",
          body: "Updated Body",
          userId: 1,
        })
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("should delete the post when delete button is clicked", async () => {
    mockSendRequest.mockResolvedValueOnce({
      title: "Test Title",
      body: "Test Body",
    });
    mockSendRequest.mockResolvedValueOnce({});

    await act(async () => {
      render(<PostPage params={{ id: "1" }} />);
    });

    const deleteButton = await screen.findByRole("button", {
      name: /delete post/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalledTimes(2);
      expect(mockSendRequest).toHaveBeenNthCalledWith(
        1,
        `${process.env.API_URL}/posts/1`,
        "GET"
      );
      expect(mockSendRequest).toHaveBeenNthCalledWith(
        2,
        `${process.env.API_URL}/posts/1`,
        "DELETE",
        JSON.stringify({ userId: 1 })
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });
});
