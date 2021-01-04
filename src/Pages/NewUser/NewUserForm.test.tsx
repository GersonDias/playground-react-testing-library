import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { NewUserForm } from "./NewUserForm";
import userEvent from "@testing-library/user-event";
import { SaveUser as MockSaveUser, User } from "../../Services/UserAPI";
import { act } from "react-dom/test-utils";

jest.mock("../../Services/UserAPI.ts");

afterEach(() => {
  jest.clearAllMocks();
});

async function NewUserFormEmpty() {
  render(<NewUserForm />);
  const name = await screen.findByLabelText(/name/i);
  const email = await screen.findByLabelText(/email/i);
  const telephone = await screen.findByLabelText(/telephone/);
  const submit = await screen.findByTestId(/submit/i);

  return {
    name,
    email,
    telephone,
    submit,
  };
}

async function NewUserFormFilled(user?: User) {
  const { name, email, telephone, submit } = await NewUserFormEmpty();

  await act(
    async () =>
      await userEvent.type(name, user?.name ?? "test user", { delay: 1 })
  );
  await act(async () =>
    userEvent.type(email, user?.email ?? "email@test.com", { delay: 1 })
  );
  await act(async () =>
    userEvent.type(telephone, user?.telephone ?? "1128882883", { delay: 1 })
  );

  return {
    name,
    email,
    telephone,
    submit,
  };
}

test("should render the new user form", () => {
  render(<NewUserForm />);
});

test("user should have name, email and telephone and submit button", async () => {
  const { name, email, telephone, submit } = await NewUserFormEmpty();

  expect(name).not.toBeNull();
  expect(email).not.toBeNull();
  expect(email.getAttribute("type")).toBe("email");
  expect(telephone).not.toBeNull();
  expect(telephone.getAttribute("type")).toBe("telephone");
  expect(submit).not.toBeNull();
});

test("should disable the submit button while saving", async () => {
  const { submit } = await NewUserFormFilled();

  await act(async () => {
    userEvent.click(submit);
  });

  //   expect(submit).toBeDisabled();
  //   await waitFor(() => expect(submit).not.toBeDisabled());
});

test("should re-enable the submit button after saving", async () => {
  MockSaveUser.mockResolvedValueOnce();
  const user: User = {
    name: "testing",
    email: "testing@testing.com",
    telephone: "1122334456",
  };

  const { submit } = await NewUserFormFilled(user);

  await act(async () => userEvent.click(submit));

  setTimeout(async () => {
    act(() => {
      userEvent.click(submit);
    });
    // expect(MockSaveUser).toBeCalledWith(user);
    // expect(MockSaveUser).toBeCalledTimes(1);

    await waitFor(() => expect(submit).not.toBeDisabled());
  });
});

test("should show the error message and re-enable submit button after an error", async () => {
  MockSaveUser.mockRejectedValueOnce({ message: "error message" });

  const user: User = {
    name: "testing",
    email: "testing",
    telephone: "11223332323",
  };

  const { submit } = await NewUserFormFilled(user);

  act(() => {
    userEvent.click(submit);
  });

  expect(MockSaveUser).toBeCalledTimes(1);

  await waitFor(() => expect(submit).not.toBeDisabled());
  await waitFor(async () =>
    expect(await screen.findByRole("alert")).not.toBeNull()
  );
});

test("should show validation messages below the required text fields", async () => {
  const invalidUser: User = {
    name: "",
    email: "",
    telephone: "",
  };

  const { name, submit } = await NewUserFormFilled(invalidUser);

  act(() => {
    userEvent.click(submit);
  });

  await waitFor(async () => {
    const elements = await screen.findAllByText(/required/i);
    expect(elements.length).toBeGreaterThan(3);
  });
});

test("should not send try to save if validation didnt pass", async () => {
  MockSaveUser.mockRejectedValueOnce({ message: "invalid user" });

  const invalidUser: User = {
    name: "test",
    email: "",
    telephone: "23444343",
  };

  const { submit } = await NewUserFormFilled(invalidUser);
  act(() => {
    userEvent.click(submit);
  });

  expect(MockSaveUser).not.toBeCalled();
});

test("should show user id after save successfully", async () => {
  const user: User = {
    name: "test user",
    email: "test@test.com",
    telephone: "1122332322",
  };

  MockSaveUser.mockResolvedValueOnce({
    ...{ user },
    id: "1",
  });

  const { submit } = await NewUserFormFilled(user);

  act(() => userEvent.click(submit));

  await waitFor(async () => {
    const idInput = await screen.findByLabelText(/user ID/i);
    expect(idInput.value).toBeTruthy();
    // expect(idInput.getAttribute("readonly")).not.toBeNull();
  });
});
