"use client";

import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { useAttendance } from "@/contexts/attendance-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CsvUploader() {
  const { loadAttendees } = useAttendance();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No se seleccionó ningún archivo",
        description: "Por favor, selecciona un archivo CSV para subir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Basic CSV parsing: assumes names are in the first column, one name per line.
        // Skips header row if present (simple check for common "name" keywords).
        const lines = text
          .split(/\r\n|\n/)
          .filter((line) => line.trim() !== "");

        let names: string[];
        if (
          lines.length > 0 &&
          /name|nombre|attendee|asistente|participant|participante/i.test(
            lines[0].split(",")[0]
          )
        ) {
          names = lines
            .slice(1)
            .map((line) => line.split(",")[0].trim())
            .filter((name) => name);
        } else {
          names = lines
            .map((line) => line.split(",")[0].trim())
            .filter((name) => name);
        }

        if (names.length === 0) {
          toast({
            title: "CSV vacío o inválido",
            description:
              "El archivo CSV no contiene nombres válidos en la primera columna.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        loadAttendees(names);
        toast({
          title: "CSV subido con éxito",
          description: `${names.length} asistentes cargados correctamente.`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error al procesar el CSV",
          description:
            "No se pudo procesar el archivo CSV. Asegúrate de que sea un CSV válido.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error al leer el archivo",
        description: "No se pudo leer el archivo seleccionado.",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Subir Lista de Asistencia</CardTitle>
        <CardDescription>
          Selecciona un archivo CSV que contenga la lista de nombres de los
          asistentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file:text-black bg-primary/10 text-black placeholder:text-black/60 focus-visible:ring-primary/80 border-black/30"
            aria-label="Upload CSV file"
          />
          <p className="text-xs text-muted-foreground">
            Formato soportado: .csv
          </p>
        </div>
        <Button
          onClick={handleFileUpload}
          disabled={isLoading || !file}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Upload className="mr-2 h-5 w-5" />
          {isLoading ? "Procesando..." : "Subir e Iniciar"}
        </Button>
      </CardContent>
    </Card>
  );
}
