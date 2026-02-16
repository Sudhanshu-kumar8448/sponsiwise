import type { InputHTMLAttributes } from "react";

// ─── Props ─────────────────────────────────────────────────────────────

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label text */
  label: string;
  /** Input name (also used as htmlFor) */
  name: string;
  /** Error message to display beneath the input */
  error?: string;
  /** Hint text shown below the label */
  hint?: string;
  /**
   * Accent colour for focus ring.
   * Provide a Tailwind colour stop like "red-400" or "blue-500".
   * Default: "blue-500"
   */
  accentColor?: string;
}

/**
 * Generic form field with label, input, hint, and error display.
 *
 * - Server Component safe (stateless)
 * - Pairs with Server Actions via `name` attribute
 * - No validation logic — errors are passed from the action state
 */
export default function FormField({
  label,
  name,
  error,
  hint,
  accentColor = "blue-500",
  className,
  ...rest
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {hint && (
        <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
      )}

      <input
        id={name}
        name={name}
        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : `border-gray-300 focus:border-${accentColor} focus:ring-${accentColor}`
        } focus:outline-none focus:ring-1`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
