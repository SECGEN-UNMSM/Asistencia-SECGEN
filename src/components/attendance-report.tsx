"use client";

import type { Attendee } from "@/contexts/attendance-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Users, HelpCircle } from "lucide-react";

interface AttendanceReportProps {
  attendees: Attendee[];
}

export default function AttendanceReport({ attendees }: AttendanceReportProps) {
  const presentAttendees = attendees.filter((a) => a.status === "present");
  const absentAttendees = attendees.filter((a) => a.status === "absent");
  const unmarkedAttendees = attendees.filter((a) => a.status === "unmarked");

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-semibold">Presentes</CardTitle>
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-500">
            {presentAttendees.length}
          </div>
          <p className="text-lg text-muted-foreground">
            de un total de {attendees.length} personas
          </p>
          <ScrollArea className="h-[200px] mt-4">
            {presentAttendees.length > 0 ? (
              <ul className="space-y-1">
                {presentAttendees.map((attendee) => (
                  <li
                    key={attendee.id}
                    className="text-sm p-2 rounded-md border"
                    data-ai-hint="person name"
                  >
                    {attendee.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Ningún asistente marcado como presente.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-semibold">Ausentes</CardTitle>
          <XCircle className="h-6 w-6 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-red-500">
            {absentAttendees.length}
          </div>
          <p className="text-lg text-muted-foreground">
            de un total de {attendees.length} personas
          </p>
          <ScrollArea className="h-[200px] mt-4">
            {absentAttendees.length > 0 ? (
              <ul className="space-y-1">
                {absentAttendees.map((attendee) => (
                  <li
                    key={attendee.id}
                    className="text-sm p-2 rounded-md border"
                    data-ai-hint="person name"
                  >
                    {attendee.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Ningún asistente marcado como ausente.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="shadow-lg md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-semibold">Sin Marcar</CardTitle>
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-muted-foreground">
            {unmarkedAttendees.length}
          </div>
          <p className="text-lg text-muted-foreground">
            de un total de {attendees.length} personas
          </p>
          <ScrollArea className="h-[200px] mt-4">
            {unmarkedAttendees.length > 0 ? (
              <ul className="space-y-1">
                {unmarkedAttendees.map((attendee) => (
                  <li
                    key={attendee.id}
                    className="text-sm p-2 rounded-md border"
                    data-ai-hint="person name"
                  >
                    {attendee.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Todos los asistentes han sido marcados.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
