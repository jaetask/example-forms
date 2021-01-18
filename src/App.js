import "./App.css";
import { actions, fields } from "xstate-form";
import { Machine, assign, spawn, send } from "xstate";
import { inspect } from "@xstate/inspect";
import TextInput from "./components/text";
import TextControl from "./components/text-control";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";

inspect({
  iframe: false,
});

const machine = Machine(
  {
    id: "myForm",
    initial: "form",
    context: {
      fieldDefinitions: [
        {
          name: "username",
          type: "text",
          validator: (c, e) => {
            const errors = {};
            if (c.value.match(/[0-9]+/g)) {
              errors.username = "Username cannot include a number";
            }
            return errors;
          },
        },
        { name: "password", type: "text" },
        { name: "submitForm", type: "submit" },
      ],
      fields: [],
    },
    states: {
      form: {
        entry: "initFields",
        on: {
          VALIDATE: "validating",
        },
      },
      validating: {
        // forward the message to ALL fields
        // entry: (c) => c.fields.map((field) => forwardTo(field.ref)), this works

        // fields will report back, but where will we know they are all completed?
        invoke: {
          id: "validator",
          src: (context, event) => (callback, onReceive) => {
            // 1. forward events to ALL the children
            // 2. wait upto X seconds for the children to response (async validating)
            // 3. Count the number of children that have responded (via messages)
            // 4. if all have responded
            // 5. apply any form level validations
            // 6. once form responded
            // 7. notify all fields of they are valid or invalid (inc error message)
            // 8. done.

            // 1. forward events to ALL the children
            // we could use forwardTo now that we send the same message
            // context.fields.map((field) =>
            //   callback({
            //     type: "VALIDATE",
            //     to: field.ref,
            //     fieldName: field.name,
            //   })
            // );

            onReceive((e) => {
              console.log("Recieved", e);

              // if we've received messages from all fields..

              // and the fomrs completed validating..

              // send them the VALIDATED message
            });

            // const id = setInterval(() => callback('INC'), 1000);

            // Perform cleanup
            return () => {};
          },
        },
      },
    },
  },
  {
    actions: {
      initFields: assign({
        fields: (c) => {
          return c.fieldDefinitions.map((field) => {
            let spawned = undefined;
            const { name, type, validator } = field;
            // todo: this could be much nicer..
            if (type === "text") {
              spawned = fields.text({ name, validator });
            } else if (type === "submit") {
              spawned = fields.submit({ name, validator });
            }
            return {
              ...field,
              ref: spawn(Machine(spawned), {
                name,
                autoForward: true,
                sync: false,
              }),
            };
          });
        },
      }),
    },
  }
);

console.log("machine", machine);

function App() {
  const [state, send, service] = useMachine(machine, { devTools: true });

  useEffect(() => {
    service.onTransition((state) => {
      console.log("state.event", state.event);
    });
  }, [service]);

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
                    name="username"
                    send={send}
                    service={service}
                    value={""}
                  />
                </td>
                <td>
                  <TextControl
                    matches={state.matches}
                    name="username"
                    send={send}
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
            <button
              type="button"
              name="validateForm"
              onClick={() => send("VALIDATE")}
              disabled={!state.matches("form")}
            >
              Validate
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
