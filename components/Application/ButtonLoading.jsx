import { Loader2 } from "lucide-react"
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const ButtonLoading = ({ type, text, loading, className, onClick, ...props }) => {
    return (
        <div>
            <Button
                type={type}
                size="sm"
                className={cn("",className)}
                disabled={loading}
                onClick={onClick}
                {...props}>
                {loading && <Loader2 className="animate-spin" />}
                {text}
            </Button>
        </div>
    );
};

export default ButtonLoading;
