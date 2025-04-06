import React from "react";

const UpdatePasswordForm = ({
  setFormType,
}: {
  setFormType: React.Dispatch<
    React.SetStateAction<"name" | "password" | "email" | null>
  >;
}) => {
  return <div>
    
    <button onClick={() => setFormType(null)}>close</button>
    UpdatePasswordForm</div>;
};

export default UpdatePasswordForm;
