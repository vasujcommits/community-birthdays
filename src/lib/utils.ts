export function daysUntilBirthday(birthday: Date | null): number {
  if (!birthday) return 9999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);

  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

export function formatBirthday(date: Date | null): string {
  if (!date) return "Unknown";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export function formatFullBirthday(date: Date | null): string {
  if (!date) return "Unknown";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function googleCalendarUrl(name: string, birthday: Date | null): string {
  if (!birthday) return "";

  const today = new Date();
  const year = today.getFullYear();
  const start = new Date(year, birthday.getMonth(), birthday.getDate());
  const end = new Date(year, birthday.getMonth(), birthday.getDate() + 1);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `🎂 ${name}'s Birthday`,
    dates: `${fmt(start)}/${fmt(end)}`,
    recur: "RRULE:FREQ=YEARLY",
    details: `It's ${name}'s birthday!`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
