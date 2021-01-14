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
    submitting: {
      after: {
        2250: "submitted",
      },
    },
    submitted: {
      after: {
        1000: "form.hist",
      },
    },
  });
};

const formMachine = Machine(buildMachine());

const fieldValue = (state, name) => state?.context?.values[name];
const isFieldDisabled = (state, name) =>
  state.matches(`form.${name}.enable.disabled`);

function App() {
  const [state, send] = useMachine(formMachine, { devTools: true });
  console.log("state.value", state.value);

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
              value={fieldValue(state, "username")}
              disabled={isFieldDisabled(state, "username")}
            />
          </div>
          <div className="field">
            <label for="password">Password:</label>
            <TextInput
              name="password"
              send={send}
              value={fieldValue(state, "password")}
              disabled={isFieldDisabled(state, "password")}
            />
          </div>

          <div className="buttons">
            <button
              name="resetForm"
              onClick={(e) => {
                e.preventDefault();
                send(actions.reset());
              }}
              disabled={
                state.matches("resetting") ||
                state.matches("submitting") ||
                state.matches("submitted")
              }
            >
              Reset
            </button>
            <button
              type="submit"
              name="submitForm"
              onClick={() => send("SUBMIT")}
              disabled={
                state.matches("resetting") ||
                state.matches("submitting") ||
                state.matches("submitted")
              }
            >
              Submit
            </button>
          </div>
          {state.matches("submitting") && (
            <div className="submitting">Submitting</div>
          )}
          {state.matches("submitted") && (
            <div className="submitted">Submitted</div>
          )}
          <div className="lastEvent">
            {JSON.stringify(state.event, null, 2)}
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
