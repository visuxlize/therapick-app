"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequiresSubscriptionProps {
  message: string;
  children: React.ReactNode;
}

export function RequiresSubscription({
  message,
  children,
}: RequiresSubscriptionProps) {
  const [open, setOpen] = useState(false);
  const { data } = trpc.stripe.getSubscriptionStatus.useQuery();
  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  if (data?.isActive || data?.isConfigured === false) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        onClickCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Maybe later
            </Button>
            <Button
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
            >
              {checkout.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
