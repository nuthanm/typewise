import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/features/home/home-page";

export default function Home() {
  return (
    <AppShell active="home" wide>
      <HomePage />
    </AppShell>
  );
}
