"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
} from "@mui/material";

interface Book {
  idbook: number;
  titulo: string;
  autor: string;
  fecha_publicacion: string;
  editorial: string;
  categoria: string;
  descripcion: string;
  status: boolean;
  coverImage: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const bookData = JSON.parse(searchParams.get("book") || "{}") as Book;
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre.trim() || !email.trim() || !fechaInicio || !fechaFin) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("El correo electrónico no es válido.");
      return;
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    try {
      console.log("Solicitud de préstamo:", {
        libro: bookData,
        nombre,
        email,
        fechaInicio,
        fechaFin,
      });
      setSuccess("Solicitud enviada con éxito");
    } catch (error) {
      setError("Hubo un error al enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleImageError = () => {
    bookData.coverImage = "/fallback.png";
  };

  return (
    <Box
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #f7f8fa, #e3e8f0)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={
                bookData.coverImage
                  ? bookData.coverImage.startsWith("http")
                    ? bookData.coverImage
                    : `/images/${bookData.coverImage}`
                  : "/../fallback.png"
              }
              alt={bookData.titulo}
              onError={handleImageError}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {bookData.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Autor: {bookData.autor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publicado en: {bookData.fecha_publicacion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Editorial: {bookData.editorial}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categoría: {bookData.categoria}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookData.descripcion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado: {bookData.status ? "Disponible" : "No disponible"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              backgroundColor: "white",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Solicitar Préstamo
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Fecha de Inicio"
                variant="outlined"
                fullWidth
                margin="normal"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "5px 2px",
                  },
                  "& .MuiInputLabel-root": {
                    top: "-7px",
                  },
                  mb: 2,
                }}
              />
              <TextField
                label="Fecha de Fin"
                variant="outlined"
                fullWidth
                margin="normal"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "5px 2px",
                  },
                  "& .MuiInputLabel-root": {
                    top: "-7px",
                  },
                  mb: 2,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "16px",
                }}
              >
                Enviar Solicitud
              </Button>
            </form>
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
