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
  const machine = form.form({
    // example of simple JS validation func, could come from any validation library..
    validate: (values, _event, _meta, _name) => {
      const errors = {};
      if (values.username.match(/[0-9]+/g)) {
        errors.username = "Username cannot include a number";
      }
      if (values.password.length <= 8) {
        errors.password = "Password must be > 8 chars";
      }
      return errors;
    },
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
  return machine;
};

// how to know when to validate? should be done via config, but where? in the meta?
const formMachine = Machine(buildMachine(), {});

/**
 * Pass in logic fileds for now, but simplify via context later
 * @param {*} param0
 */
const FieldError = ({ _name, hasError, error }) =>
  hasError ? <div className="fieldError">{error}</div> : null;

function App() {
  const {
    fieldValue,
    isFieldDisabled,
    isFieldFocused,
    isFieldValid,
    isFieldVisible,
    hasErrors,
    hasFieldError,
    fieldError,
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
              {hasFieldError("username") && (
                <tr>
                  <td colSpan="3">
                    <FieldError
                      name="username"
                      hasError={hasFieldError("username")}
                      error={fieldError("username")}
                    />
                  </td>
                </tr>
              )}
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
              {hasFieldError("password") && (
                <tr>
                  <td colSpan="3">
                    <FieldError
                      name="password"
                      hasError={hasFieldError("password")}
                      error={fieldError("password")}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="buttons">
            <button
              name="resetForm"
              onClick={(e) => {
                e.preventDefault();
                send(actions.reset());
              }}
              disabled={!state.matches("form") || hasErrors}
            >
              Reset
            </button>
            <button
              type="submit"
              name="submitForm"
              onClick={() => send("SUBMIT")}
              disabled={!state.matches("form") || hasErrors}
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
            {JSON.stringify(state.context, null, 2)}
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
