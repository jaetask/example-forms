import { actions } from "xstate-form";

const TextControl = ({
  name,
  send,
  disabled = false,
  visible = true,
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
  </>
);

export default TextControl;
