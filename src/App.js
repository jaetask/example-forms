import "./App.css";
import { actions, form, fields } from "xstate-form";
import { Machine } from "xstate";
import { inspect } from "@xstate/inspect";
import useFormMachine from "./hooks/useFormMachine";
import TextInput from "./components/text";
import TextControl from "./components/text-control";

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
      password: "ThisIsTheWay",
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

function App() {
  const {
    fieldValue,
    isFieldDisabled,
    isFieldFocused,
    isFieldValid,
    isFieldVisible,
    send,
    state,
  } = useFormMachine(formMachine, {
    devTools: true,
  });

  return (
    <div className="app">
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <table>
            <tbody>
              <tr>
                <td className="field">
                  <label for="username">Name:</label>
                </td>
                <td>
                  <TextInput
                    disabled={isFieldDisabled("username")}
                    name="username"
                    send={send}
                    value={fieldValue("username")}
                    visible={isFieldVisible("username")}
                    valid={isFieldValid("username")}
                    focused={isFieldFocused("username")}
                  />
                </td>
                <td>
                  <TextControl
                    disabled={isFieldDisabled("username")}
                    matches={state.matches}
                    name="username"
                    send={send}
                    visible={isFieldVisible("username")}
                    valid={isFieldValid("username")}
                  />
                </td>
              </tr>
              <tr>
                <td className="field">
                  <label for="password">Password:</label>
                </td>
                <td>
                  <TextInput
                    disabled={isFieldDisabled("password")}
                    name="password"
                    send={send}
                    value={fieldValue("password")}
                    visible={isFieldVisible("password")}
                    valid={isFieldValid("password")}
                    focused={isFieldFocused("password")}
                  />
                </td>
                <td>
                  <TextControl
                    disabled={isFieldDisabled("password")}
                    matches={state.matches}
                    name="password"
                    send={send}
                    visible={isFieldVisible("password")}
                    valid={isFieldValid("password")}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="buttons">
            <button
              name="resetForm"
              onClick={(e) => {
                e.preventDefault();
                send(actions.reset());
              }}
              disabled={!state.matches("form")}
            >
              Reset
            </button>
            <button
              type="submit"
              name="submitForm"
              onClick={() => send("SUBMIT")}
              disabled={!state.matches("form")}
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
          <div className="stateValue">
            {JSON.stringify(state.value, null, 2)}
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
