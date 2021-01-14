import "./App.css";
import { actions, form, fields } from "xstate-form";
import { Machine } from "xstate";
import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import TextInput from "./components/text";

inspect({
  iframe: false,
});

const buildMachine = () => {
  return form.form({
    fields: {
      username: fields.text("username"), //todo, provide method to extend field actions
      password: fields.text("password"),
      // ...
      submitForm: fields.submit("submitForm"),
    },
    initialValues: {
      username: "jaetask",
    },
  });
};

const formMachine = Machine(buildMachine());

function App() {
  const [state, send] = useMachine(formMachine, { devTools: true });
  return (
    <div className="app">
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="field">
            <label for="username">Name:</label>
            <TextInput
              name="username"
              send={send}
              value={state.context.values.username}
            />
          </div>
          <div className="field">
            <label for="password">Password:</label>
            <TextInput
              name="password"
              send={send}
              value={state.context.values.password}
            />
          </div>

          <div className="buttons">
            <button name="resetForm" onClick={() => send(actions.reset())}>
              Reset
            </button>
            <button
              type="submit"
              name="submitForm"
              onClick={() => send("SUBMIT")}
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
