import { classNames } from "../utils";

type TypographyProps = {
  text: string;
  type: "title" | "description" | "base" | "muted" | "name";
  size?: "normal" | "small" | "large";
};

enum Size {
  Normal = "normal",
  Small = "small",
  Large = "large",
}

enum Type {
  Title = "title",
  Description = "description",
  Name = "name",
  Muted = "muted",
  Base = "base",
}

const SizeMap = {
  [Size.Large]: "text-xl",
  [Size.Small]: "text-xs",
  [Size.Normal]: "text-base",
};

const TypeMap = {
  [Type.Title]: "text-gray-700 font-bold mb-3",
  [Type.Description]: "text-gray-500 mb-3 text-lg",
  [Type.Name]: "text-slate-600 font-semibold",
  [Type.Muted]: "text-slate-400",
  [Type.Base]: "text-slate-600",
};

/** Typography */
const Typography: React.FC<TypographyProps> = ({
  text,
  type = "base",
  size = "normal",
}) => {
  return (
    <div className="flex items-center">
      <p className={classNames(TypeMap[type], SizeMap[size])}>{text}</p>
    </div>
  );
};

export default Typography;
