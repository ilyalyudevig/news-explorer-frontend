import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return { values, setValues, handleChange };
}
