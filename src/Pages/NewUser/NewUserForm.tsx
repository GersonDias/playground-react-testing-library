import { Button, TextField, Typography } from "@material-ui/core";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { SaveUser, User } from "../../Services/UserAPI";

import "./NewUserForm.css";

const initialState: User = {
  name: "",
  email: "",
  telephone: "",
};

function NewUserForm() {
  const [saving, setIsSaving] = useState(false);
  const [error, setError] = useState<undefined | Record<keyof User, string>>(
    undefined
  );

  const [user, setUser] = useState<User>(initialState);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSaving(true);
    setError(undefined);
    if (validate()) {
      try {
        const savedUser = await SaveUser(user);
        setUser(savedUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsSaving(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser((current) => {
      const newState = {
        ...current,
        [e.target?.name]: e.target?.value.trim(),
      };

      return newState;
    });
  }

  function validate() {
    const error = {} as Record<keyof User, string>;
    const required_message = "required";

    if (!user.name.trim()) {
      error["name"] = required_message;
    }
    if (!user.email.trim()) {
      error["email"] = required_message;
    }
    if (!user.telephone.trim()) {
      error["telephone"] = required_message;
    }

    if (error) {
      setError(error);
    }

    // console.log("validation return", error);
    return Object.keys(error).length === 0;
  }

  return (
    <div className="new-user-form">
      <Typography variant="h5">New user form</Typography>
      <form onSubmit={handleSubmit} autoComplete={""}>
        {user?.id && (
          <TextField
            fullWidth
            margin="normal"
            label="user ID"
            name="id"
            id={"userID"}
            value={user?.id || ""}
            InputProps={{ readOnly: true }}
          />
        )}
        <TextField
          fullWidth
          margin="normal"
          label="name"
          name="name"
          value={user?.name}
          onChange={handleChange}
          id="name"
          helperText={error?.name || ""}
          error={Boolean(error?.name)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="email"
          name="email"
          id="email"
          value={user?.email || ""}
          onChange={handleChange}
          type="email"
          helperText={error?.email}
          error={Boolean(error?.email)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="telephone"
          name="telephone"
          id="telephone"
          value={user?.telephone || ""}
          onChange={handleChange}
          type="telephone"
          helperText={error?.telephone}
          error={Boolean(error?.telephone)}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={saving}
          type="submit"
          data-testid="btn-submit"
        >
          submit
        </Button>
        {error && <div role="alert">{JSON.stringify(error)}</div>}
      </form>
    </div>
  );
}

export { NewUserForm };
