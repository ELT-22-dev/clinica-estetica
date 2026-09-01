import { avatarPalette, initials } from "@/lib/avatar";

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const { bg, fg } = avatarPalette(name);
  return (
    <div
      className="flex flex-none items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  );
}
