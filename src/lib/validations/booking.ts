import { z } from 'zod';

const referenteSchema = z.object({
  nome:     z.string().min(2, 'Nome richiesto'),
  cognome:  z.string().min(2, 'Cognome richiesto'),
  telefono: z.string().regex(/^\+?[\d\s\-]{8,15}$/, 'Numero non valido'),
  email:    z.string().email('Email non valida'),
});

export const groupSchema = z.object({
  nome_gruppo:             z.string().min(2, 'Nome gruppo richiesto'),
  num_persone:             z.number().min(1).max(100),
  referente:               referenteSchema,
  note:                    z.string().optional(),
});

export const fullBookingSchema = z.object({
  grotta_id:     z.string(),
  data_checkin:  z.string(),
  data_checkout: z.string(),
  fascia_oraria: z.enum(['mattina', 'pomeriggio', 'intera_giornata']),
  ...groupSchema.shape,
});
