import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PrivacyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border border-neutral-700 bg-[#111111] text-white shadow-xl p-6 w-full max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Terms & Conditions
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-neutral-300 mt-3 space-y-3">
            <p>
              This is an <strong>early-alpha</strong> version of Paystream deployed on mainnet. Proceed with caution.
            </p>
            <p>
              Contracts are <strong>not audited</strong>, but only whitelisted addresses can interact with them.
            </p>
            <p>
              By using Paystream, you accept the risks associated with unaudited smart contracts.
            </p>
            <p>
              Read more about our protocol security{" "}
              <a
                href="https://app.paystream.finance/security"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-500 transition"
              >
                here
              </a>.
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <input
                type="checkbox"
                id="accept"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-neutral-600 bg-neutral-800 focus:ring-0"
              />
              <label htmlFor="accept" className="text-sm text-neutral-400">
                I have read and accept the Terms & Conditions
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex justify-end space-x-3">
          <AlertDialogCancel
            className="rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition px-4 py-2"
          >
            Reject
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!accepted}
            className={`rounded-full px-4 py-2 transition text-white ${
              accepted
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600/50 cursor-not-allowed"
            }`}
          >
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
