import "./App.css";
import { actions, fields } from "xstate-form";
import { Machine, assign, spawn, forwardTo } from "xstate";
import { inspect } from "@xstate/inspect";
import TextInput from "./components/text";
import TextControl from "./components/text-control";
import { useMachine, useService } from "@xstate/react";
import { useEffect } from "react";
import { pure, raise } from "xstate/lib/actions";

inspect({
  iframe: false,
});

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

const machine = Machine(
  {
    id: "myForm",
    initial: "init",
    context: {
      fieldDefinitions: [
        {
          name: "username",
          type: "text",
          validator: (c, e) => {
            // contrived async validator example
            const errors = {};
            if (c.value.match(/[0-9]+/g)) {
              errors.username = "Username cannot include a number";
            }

            return delay(2500, errors);
          },
        },
        { name: "password", type: "text" },
        { name: "submitForm", type: "submit" },
      ],
      fields: [],
    },
    states: {
      init: {
        entry: "initFields",
        after: {
          10: "form",
        },
      },
      form: {
        on: {
          // forward all fieldName messages
          "*": {
            actions: forwardTo((_, e) => e.fieldName),
            cond: (_, e) => e.fieldName !== undefined,
          },
          VALIDATE: "validating",
        },
      },
      validating: {
        entry: [
          assign({
            results: (c) => {
              return {
                expectingCount: c.fields
                  .map((field) => field.type === "text")
                  .filter(Boolean).length,
                validationResults: [],
                errors: {},
              };
            },
          }),
          pure((c: any) => {
            c.fields.map((field) => {
              field.ref.send("VALIDATE");
            });
          }),
        ],
        // forward the message to ALL fields
        // entry: (c) => c.fields.map((field) => forwardTo(field.ref)), this works

        // fields will report back, but where will we know they are all completed?
        invoke: {
          id: "validator",
          src: (context) => (callback, onReceive) => {
            // 1. forward events to ALL the children
            // 2. wait X seconds for the children to response (async validating)
            // 3. Count the number of children that have responded (via messages)
            // 4. if all have responded
            // 5. apply any form level validations
            // 6. once form responded
            // 7. notify all fields of they are valid or invalid (inc error message)
            // 8. done.
            // 1. forward events to ALL the children
            // context.fields.map((field) => {
            //   field.ref.send("VALIDATE");
            // });
            // 2. wait X seconds for the children to response (async validating)
            // the children respond via VALIDATION_RESULT messages
          },
        },
        on: {
          VALIDATION_COMPLETE: "form",
          VALIDATION_RESULT: {
            // do nothing..
            actions: [
              assign({
                // results: (c, e) => {
                //   const validationResults = [...c.results.validationResults];
                //   validationResults.push(e);
                //   return validationResults;
                // },
                results: (c, e) => {
                  const results = {
                    expectingCount: c.results.expectingCount,
                    validationResults: [...c.results.validationResults, e],
                    errors: { ...c.results.errors, ...e.errors },
                  };
                  return results;
                },
              }),
              pure((c) => {
                return c.results.validationResults.length ===
                  c.results.expectingCount
                  ? raise("VALIDATION_COMPLETE")
                  : undefined;
              }),
            ],
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
                autoForward: false,
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
  const childService = service.children.get("username");
  const [usernameState] = useService(childService ? childService : service);

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
                    matches={usernameState.matches}
                    value={usernameState.context.value}
                  />
                </td>
                <td>
                  <TextControl
                    name="username"
                    disabled={usernameState.matches("enable.disabled")}
                    matches={state.matches}
                    send={send}
                    visible={usernameState.matches("visible.visible")}
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
              onClick={() =>
                state.matches("validating")
                  ? send("FORM_VALIDATION_COMPLETE")
                  : send("VALIDATE")
              }
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
