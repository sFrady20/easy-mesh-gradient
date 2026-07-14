import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDownIcon } from "./icons";

/** Range input with a filled track. Pass `color` to tint the fill. */
export function Slider({
  value,
  min = 0,
  max = 100,
  color,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  value: number;
  min?: number;
  max?: number;
  color?: string;
}) {
  const fill = ((value - min) / (max - min || 1)) * 100;
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      className={`range w-full ${className}`}
      style={
        {
          "--range-fill": fill,
          ...(color ? { "--range-color": color } : {}),
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

/** Labeled slider row with the current value surfaced on the right. */
export function SliderField({
  label,
  display,
  ...props
}: Parameters<typeof Slider>[0] & { label: string; display?: string }) {
  const id = useId();
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] text-gray-600">
          {label}
        </label>
        <span className="font-mono text-xs text-gray-900 tabular-nums">
          {display ?? props.value}
        </span>
      </div>
      <Slider id={id} {...props} />
    </div>
  );
}

/** A min/max pair of sliders sharing one label. */
export function RangeField({
  label,
  value,
  min,
  max,
  step,
  format = (v) => `${v}`,
  onChange,
}: {
  label: string;
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (value: [number, number]) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] text-gray-600">{label}</span>
        <span className="font-mono text-xs text-gray-900 tabular-nums">
          {format(value[0])} – {format(value[1])}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          value={value[0]}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
        />
        <Slider
          value={value[1]}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
        />
      </div>
    </div>
  );
}

/** Round color swatch that opens the native color picker. */
export function ColorSwatch({
  value,
  onChange,
  size = 28,
}: {
  value: string;
  onChange: (hex: string) => void;
  size?: number;
}) {
  return (
    <label
      className="relative shrink-0 cursor-pointer rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110"
      style={{ width: size, height: size, backgroundColor: value }}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Pick color"
      />
    </label>
  );
}

/** iOS-style segmented control. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex rounded-lg bg-gray-100 p-0.5 ${className}`}
      role="tablist"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-[7px] px-2.5 py-1.5 text-xs font-medium transition-all ${
            value === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Collapsible panel section with a disclosure chevron. */
export function Section({
  title,
  action,
  defaultOpen = true,
  children,
}: {
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl bg-white shadow-card">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          <ChevronDownIcon
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
          />
        </button>
        {action}
      </header>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}
