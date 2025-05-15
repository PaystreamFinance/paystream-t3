import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function PrivacyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  //  "https://app.paystream.finance";
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none border-none bg-bg-t3">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Privacy dialog
          </AlertDialogTitle>
      <AlertDialogTitle className="text-white">
            Terms & Conditions
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-300 space-y-2">
            <p>
              This is an early-alpha version of Paystream deployed on mainnet. Please proceed with caution.
            </p>
            <p>
              Contracts are <strong>not audited</strong>. However, interactions are restricted to whitelisted addresses only.
            </p>
            <p>
              By using this protocol, you acknowledge the inherent risks of interacting with unaudited smart contracts.
            </p>
            <p>
              For more information about Paystream’s security model and roadmap, please visit{" "}
              <a
                href="https://app.paystream.finance/security"
                className="underline text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                our security page
              </a>.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
