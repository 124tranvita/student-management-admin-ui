import React from "react";
import { FieldConfig, useField } from "formik";
// import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

type Props = {
  children?: React.ReactNode;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

// Follow the Formik document
export const FormikTextInput: React.FC<Props & FieldConfig> = ({
  label,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        autoFocus
        className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </>
  );
};

export const FormikCheckbox: React.FC<Props & FieldConfig> = ({
  children,
  ...props
}) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const FormikSelect: React.FC<Props & FieldConfig> = ({
  label,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <select
        className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

// export const MyPasswordInput: React.FC<Props & FieldConfig> = ({
//   label,
//   eyeColor,
//   ...props
// }) => {
//   const [field, meta] = useField(props);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <>
//       <div className="relative">
//         <label
//           htmlFor={props.id || props.name}
//           className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-300"
//         >
//           {label}
//         </label>
//         <input
//           type={!showPassword ? "password" : "text"}
//           {...field}
//           {...props}
//         />
//         {meta.touched && meta.error ? (
//           <div className="text-sm text-red-500">{meta.error}</div>
//         ) : null}

//         <span
//           className={`absolute right-1 cursor-pointer top-10 ${
//             eyeColor ? eyeColor : "text-violet-600 dark:text-slate-200"
//           }`}
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           {!showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//         </span>
//       </div>
//     </>
//   );
// };
