import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev);
        };

        return (
            <div className="w-full relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent pl-3 pr-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        className
                    )}
                    ref={ref}
                    data-slot="input"
                    aria-invalid={!!error}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </button>
                {/* ✅ optional error text display */}
                {error && (
                    <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
