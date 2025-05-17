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

export function WaitlistDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="shady" className="mt-7">
          We are live
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-lg rounded-2xl border border-neutral-700 bg-[#111111] p-6 text-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Access Restricted
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-3 space-y-3 text-sm text-neutral-300">
            <p>
              Only whitelisted addresses can interact with the Paystream app.
            </p>
            <p>
              If you are not whitelisted yet, join our Telegram and follow the
              instructions to request access.
            </p>
            <p></p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex justify-end space-x-3">
          <AlertDialogCancel className="rounded-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-300 transition hover:bg-neutral-700">
            <a
              href="https://app.paystream.finance"
              target="_self"
              rel="noopener noreferrer"
            >
              Already Whitelisted
            </a>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            <a
              href="https://t.me/paystreamfi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Telegram
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
