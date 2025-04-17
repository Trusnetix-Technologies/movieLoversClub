import dynamic from "next/dynamic";
import { useState, useRef } from "react";
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");

    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);
const CommentTextBox = ({ value, setValue, readOnly }) => {
  const editorRef = useRef(null);

  return (
    <ReactQuill
      forwardedRef={editorRef}
      theme={readOnly ? "bubble" : "snow"}
      value={value}
      onChange={setValue}
      readOnly={readOnly}
    />
  );
};

export default CommentTextBox;
