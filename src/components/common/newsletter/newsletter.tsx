import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Subscribe. join the cult.</h2>
      <p className="text-sm text-gray-500">
        For those who see beauty in the game.
      </p>

      <input type="email" placeholder="Enter your email" />
      <Button>Subscribe</Button>
      <p>
        By joining, you agree to our Terms of Use, our Privacy Policy, and how
        we keep your info safe.
      </p>
    </div>
  );
}
