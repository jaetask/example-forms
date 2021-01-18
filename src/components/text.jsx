import { actions } from "xstate-form";
import classnames from "classnames";
import { useService } from "@xstate/react";

// inputs should not know about services!
// this is aterrible idea!

const TextInput = ({
  name,
  service, // todo, pass this is in properly, rapid prototyping..
}) => {
  // todo: I dont like that its here but..
  const childService = service.children.get(name);
  // we now have access to the child machine state
  const [_parentState, send] = useService(service);
  const [state] = useService(childService ? childService : service);

  return (
    <input
      type="text"
      name={name}
      value={state.context.value}
      className={classnames([
        "textInput",
        state.matches("enable.disabled") ? "disabled" : null,
        state.matches("visible.invisible") ? "invisible" : null,
        state.matches("valid.invalid") ? "invalid" : null,
      ])}
      onFocus={() => {
        send(actions.focus(name));
      }}
      onBlur={() => {
        send(actions.blur(name));
      }}
      onChange={(e) => {
        send(actions.change(name, e.target.value));
      }}
      disabled={state.matches("enable.disabled")}
    />
  );
};

export default TextInput;
