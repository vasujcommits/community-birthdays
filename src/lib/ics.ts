interface BirthdayEvent {
  id: string;
  name: string;
  birthday: Date;
  withReminder: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function nextDay(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return isoDate(d);
}

function esc(s: string) {
  return s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function generateICS(events: BirthdayEvent[], calName = "Birthdays"): string {
  const vevents = events.map((e) => {
    const lines = [
      "BEGIN:VEVENT",
      `UID:birthday-${e.id}@birthdaytracker`,
      `DTSTART;VALUE=DATE:${isoDate(e.birthday)}`,
      `DTEND;VALUE=DATE:${nextDay(e.birthday)}`,
      "RRULE:FREQ=YEARLY",
      `SUMMARY:🎂 ${esc(e.name)}'s Birthday`,
      `DESCRIPTION:It's ${esc(e.name)}'s birthday!`,
    ];

    if (e.withReminder) {
      lines.push(
        "BEGIN:VALARM",
        "TRIGGER:-P7D",
        "ACTION:DISPLAY",
        `DESCRIPTION:🎂 ${esc(e.name)}'s birthday is in 7 days!`,
        "END:VALARM"
      );
    }

    lines.push("END:VEVENT");
    return lines.join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CommunityBirthdays//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calName)}`,
    ...vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}
