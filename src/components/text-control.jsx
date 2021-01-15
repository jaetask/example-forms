import { actions } from "xstate-form";

const TextControl = ({
  name,
  send,
  disabled = false,
  visible = true,
  valid = true,
  matches,
}) => (
  <>
    <button
      name={`${name}Enable`}
      onClick={(e) => {
        e.preventDefault();
        disabled ? send(actions.enable(name)) : send(actions.disable(name));
      }}
      disabled={!matches("form")}
    >
      {disabled ? "Enable" : "Disable"}
    </button>
    <button
      name={`${name}Visible`}
      onClick={(e) => {
        e.preventDefault();
        visible ? send(actions.invisible(name)) : send(actions.visible(name));
      }}
      disabled={!matches("form")}
    >
      {visible ? "Hide" : "Show"}
    </button>
    <button
      name={`${name}Valid`}
      onClick={(e) => {
        e.preventDefault();
        valid ? send(actions.invalid(name)) : send(actions.valid(name));
      }}
      disabled={!matches("form")}
    >
      {valid ? "Invalid" : "Valid"}
    </button>
  </>
);

export default TextControl;
