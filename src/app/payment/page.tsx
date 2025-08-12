import "../globals.css";
import Success from "@/components/Sections/Payment/Success";
import Failed from "@/components/Sections/Payment/Failed";

export default function Payment() {
  return (
    <main>
      <Success />
      <Failed />
    </main>
  );
}
