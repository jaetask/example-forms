import { actions } from "xstate-form";

// we pass in send here but it could easily come from context
const TextInput = ({ name, value = "", send, disabled = false }) => (
  <input
    type="text"
    name={name}
    value={value}
    className="textInput"
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