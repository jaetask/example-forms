import { actions } from "xstate-form";
import classnames from "classnames";

/**
 * Try to keep the Field components API clean
 *
 */
const TextInput = ({ name, matches, send, value }) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      className={classnames([
        "textInput",
        matches("enable.disabled") ? "disabled" : null,
        matches("visible.invisible") ? "invisible" : null,
        matches("valid.invalid") ? "invalid" : null,
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
      disabled={matches("enable.disabled")}
    />
  );
};

export default TextInput;
