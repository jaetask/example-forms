import { actions } from "xstate-form";
import classnames from "classnames";

// we pass in send here but it could easily come from context
const TextInput = ({
  name,
  value = "",
  send,
  disabled = false,
  visible = true,
}) => (
  <input
    type="text"
    name={name}
    value={value}
    className={classnames("textInput", !visible ? "invisible" : null)}
    onFocus={() => {
      send(actions.focus(name));
    }}
    onBlur={() => {
      send(actions.blur(name));
    }}
    onChange={(e) => {
      send(actions.change(name, e.target.value));
    }}
    disabled={disabled}
  />
);

export default TextInput;
