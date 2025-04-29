import { useState, useRef } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const input = inputRefs.current[name];
    const validationMessage = input ? input.validationMessage : "";
    setErrors((prev) => ({ ...prev, [name]: validationMessage }));
  };

  const getInputRef = (name) => (el) => {
    if (el) inputRefs.current[name] = el;
  };

  return { values, setValues, handleChange, errors, getInputRef };
}
