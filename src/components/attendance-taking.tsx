"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAttendance, type Attendee } from "@/contexts/attendance-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  SkipBack,
  SkipForward,
  CheckCircle2,
  XCircle,
  ListChecks,
  Search,
  Users,
} from "lucide-react";

export default function AttendanceTaking() {
  const { attendees, updateAttendeeStatus } = useAttendance();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredAttendees = useMemo(() => {
    if (!searchTerm) {
      return attendees;
    }
    return attendees.filter((attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendees, searchTerm]);

  const handleNext = () => {
    if (currentIndex < attendees.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentAttendee = attendees[currentIndex];
  const progress =
    attendees.length > 0
      ? (attendees.filter((a) => a.status !== "unmarked").length /
          attendees.length) *
        100
      : 0;

  useEffect(() => {
    if (
      currentAttendee &&
      !filteredAttendees.find((a) => a.id === currentAttendee.id) &&
      filteredAttendees.length > 0
    ) {
      // This logic might need refinement if search causes jumps. For now, it's kept as is.
      // const originalIndexOfFirstFiltered = attendees.findIndex(a => a.id === filteredAttendees[0].id);
      // if (originalIndexOfFirstFiltered !== -1) {
      // // setCurrentIndex(originalIndexOfFirstFiltered);
      // }
    }
  }, [searchTerm, filteredAttendees, currentAttendee, attendees]);

  const handleAttendeeSelect = (attendeeId: string) => {
    const originalIndex = attendees.findIndex((a) => a.id === attendeeId);
    if (originalIndex !== -1) {
      setCurrentIndex(originalIndex);
    }
  };

  const presentCount = attendees.filter((a) => a.status === "present").length;
  const absentCount = attendees.filter((a) => a.status === "absent").length;

  if (attendees.length === 0) {
    return <p>No hay asistentes cargados. Por favor, sube un archivo CSV.</p>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="shadow-xl lg:flex-grow">
          <CardHeader>
            {/*<CardTitle className="text-4xl font-bold text-center text-black">
              Tomar Asistencia
            </CardTitle>*/}
            <Progress
              value={progress}
              className="w-full mt-2 bg-primary/20"
              aria-label={`${progress.toFixed(0)}% completado`}
            />
            <p className="text-center text-lg text-muted-foreground mt-1">{`Asistente ${
              currentIndex + 1
            } de ${attendees.length}`}</p>
          </CardHeader>
          {currentAttendee && (
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/10 rounded-lg shadow">
                <h2
                  className="text-4xl font-semibold text-black my-2"
                  data-ai-hint="person name"
                >
                  {currentAttendee.name}
                </h2>
              </div>

              <div className="flex justify-center items-center space-x-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <SkipBack className="mr-2 h-5 w-5" /> Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === attendees.length - 1}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Siguiente <SkipForward className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <RadioGroup
                value={currentAttendee.status}
                onValueChange={(status) =>
                  updateAttendeeStatus(
                    currentAttendee.id,
                    status as "present" | "absent" | "unmarked"
                  )
                }
                className="flex flex-col sm:flex-row justify-center items-center gap-4 py-4"
              >
                <div className="flex items-center">
                  <RadioGroupItem
                    value="present"
                    id={`status-present-${currentAttendee.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`status-present-${currentAttendee.id}`}
                    className="flex items-center justify-center w-48 h-16 p-3 border-2 rounded-lg shadow-md cursor-pointer text-lg font-semibold
                               transition-all duration-150 ease-in-out
                               peer-data-[state=unchecked]:bg-card peer-data-[state=unchecked]:text-card-foreground peer-data-[state=unchecked]:border-border
                               peer-data-[state=checked]:bg-green-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-green-700
                               hover:peer-data-[state=unchecked]:bg-green-50 hover:peer-data-[state=unchecked]:border-green-400
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle2 className="mr-2 h-6 w-6" /> Asistió
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem
                    value="absent"
                    id={`status-absent-${currentAttendee.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`status-absent-${currentAttendee.id}`}
                    className="flex items-center justify-center w-48 h-16 p-3 border-2 rounded-lg shadow-md cursor-pointer text-lg font-semibold
                               transition-all duration-150 ease-in-out
                               peer-data-[state=unchecked]:bg-card peer-data-[state=unchecked]:text-card-foreground peer-data-[state=unchecked]:border-border
                               peer-data-[state=checked]:bg-red-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-red-700
                               hover:peer-data-[state=unchecked]:bg-red-50 hover:peer-data-[state=unchecked]:border-red-400
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle className="mr-2 h-6 w-6" /> No Asistió
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          )}
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => router.push("/summary")}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <ListChecks className="mr-2 h-5 w-5" /> Ver Registro
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-xl lg:w-full lg:max-w-xs xl:max-w-sm">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-black">
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-3xl">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="mr-3 h-6 w-6 text-[#009900]" />
                <span className="font-medium">Asistentes:</span>
              </div>
              <span className="font-bold text-[#009900]">{presentCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
              <div className="flex items-center">
                <XCircle className="mr-3 h-6 w-6 text-red-500" />
                <span className="font-medium">Ausentes:</span>
              </div>
              <span className="font-bold text-red-500">{absentCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md mt-4 text-4xl">
              <div className="flex items-center">
                <Users className="mr-3 h-6 w-6 text-[#9E8110]" />
                <span className="font-medium">Total:</span>
              </div>
              <span className="font-bold text-[#9E8110]">
                {attendees.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Asistentes</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/80" />
            <Input
              type="search"
              placeholder="Buscar asistente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-primary/10 text-black placeholder:text-black/60 focus-visible:ring-primary/80"
              aria-label="Buscar asistente"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border">
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee, index) => (
                <React.Fragment key={attendee.id}>
                  <div
                    className={`flex justify-between items-center p-3 cursor-pointer hover:bg-primary/20 ${
                      attendee.id === currentAttendee?.id
                        ? "bg-primary/20 shadow-md ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleAttendeeSelect(attendee.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleAttendeeSelect(attendee.id);
                      }
                    }}
                    aria-label={`Seleccionar ${attendee.name}`}
                  >
                    <span className={`font-medium text-black`}>
                      {attendee.name}
                    </span>
                    <span
                      className={`text-sm capitalize font-semibold ${
                        attendee.status === "present"
                          ? "text-green-600"
                          : attendee.status === "absent"
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {attendee.status === "present"
                        ? "Asistió"
                        : attendee.status === "absent"
                        ? "No Asistió"
                        : ""}
                    </span>
                  </div>
                  {index < filteredAttendees.length - 1 && (
                    <Separator className="my-0" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                No se encontraron asistentes con ese nombre.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
