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
      <AlertDialogContent className="rounded-2xl border border-neutral-700 bg-[#111111] text-white shadow-xl p-6 w-full max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Access Restricted
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-neutral-300 mt-3 space-y-3">
            <p>Only whitelisted addresses can interact with the Paystream app.</p>
            <p>
              If you are not whitelisted yet, join our Telegram and follow the
              instructions to request access.
            </p>
            <p>
              <a
                href="https://t.me/paystreamprotocol"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-500 transition"
              >
                Join Telegram
              </a>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex justify-end space-x-3">
          <AlertDialogCancel className="rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition px-4 py-2">
            Already Whitelisted
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="rounded-full px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            <a
              href="https://t.me/paystreamprotocol"
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
