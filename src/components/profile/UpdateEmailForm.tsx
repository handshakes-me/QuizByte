import React from "react";

const UpdateEmailForm = ({
  setFormType,
}: {
  setFormType: React.Dispatch<
    React.SetStateAction<"name" | "password" | "email" | null>
  >;
}) => {
  return <div>
    <button onClick={() => setFormType(null)}>close</button>
    UpdateEmailForm</div>;
};

export default UpdateEmailForm;
