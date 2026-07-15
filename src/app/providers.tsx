import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "../lib/queryClient";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient} >
            {children}
            < Toaster richColors position="top-right" />
        </QueryClientProvider>
    );
}