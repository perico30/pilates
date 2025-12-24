
export type EvaluationData = {
  // 1. Datos Personales
  nombre: string;
  edad: string;
  sexo: string;
  telefono: string;
  ocupacion: string;

  // 2. Objetivo Principal
  objetivos: string[];
  otroObjetivo: string;

  // 3. Experiencia y Actividad Física
  realizaActividad: string;
  cualActividad: string;
  diasEntrenamiento: string;
  practicoPilates: string;
  haceCuantoPilates: string;
  experienciaPilates: string;
  condicionFisica: number;

  // 4. Dolor, Molestias
  tieneDolor: string;
  zonasDolor: string[];
  otraZonaDolor: string;
  intensidadDolor: number;
  duracionDolor: string;
  queEmpeora: string;
  queMejora: string;
  movimientosEvita: string;

  // 5. Historial Médico
  lesionesImportantes: string;
  cualesLesiones: string;
  cirugias: string;
  cualesCirugias: string;
  prohibicionEjercicio: string;
  explicacionProhibicion: string;

  // 6. Condiciones de Salud
  condicionesSalud: string[];
  semanasEmbarazo: string;
  otraCondicionSalud: string;
  tomaMedicacion: string;
  cualMedicacion: string;

  // 7. Señales de Alerta
  redFlags: string[];

  // 8. Hábitos Posturales
  horasSentado: string;
  duermeBien: string;
  horasSueno: string;
  nivelEstres: string;
  zonaTensa: string;

  // 9. Percepción Corporal
  rigidoFlexible: string;
  cansaEstarDePie: string;
  posturaBuena: string;

  // 10. Expectativas
  expectativa1Mes: string;
  expectativa3Meses: string;
  impedimentoConstancia: string[];
  otroImpedimento: string;
};

export interface DiagnosisResponse {
  analisis: string;
  recomendaciones: string[];
  puntosAtencion: string[];
  aptitud: 'APTO' | 'APTO_AJUSTES' | 'MEDICO';
}
