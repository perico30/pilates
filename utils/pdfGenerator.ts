
import { EvaluationData, DiagnosisResponse } from "../types";

// Note: jsPDF and autoTable are loaded via CDN in index.html
declare var jspdf: any;

export const downloadPDF = (data: EvaluationData) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // Branding
  doc.setFont("playfair", "bold");
  doc.setFontSize(24);
  doc.setTextColor(74, 93, 78);
  doc.text("Angi Pilates Studio", pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  doc.setFontSize(12);
  doc.setFont("quicksand", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Ficha de Evaluación Inicial - Pilates Reformer", pageWidth / 2, currentY, { align: "center" });
  currentY += 15;

  // 1. Datos Personales
  const personalTable = [
    ["Nombre completo", data.nombre],
    ["Edad", data.edad + " años"],
    ["Sexo", data.sexo],
    ["Teléfono", data.telefono],
    ["Ocupación", data.ocupacion]
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [['1. Datos Personales', '']],
    body: personalTable,
    theme: 'striped',
    headStyles: { fillColor: [124, 144, 130] },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
  });
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 2. Objetivos y 3. Actividad Física
  const goalsActivity = [
    ["Objetivos", data.objetivos.join(', ') + (data.otroObjetivo ? ` (${data.otroObjetivo})` : '')],
    ["Actividad física actual", data.realizaActividad === 'Sí' ? `Sí: ${data.cualActividad}` : 'No'],
    ["Frecuencia semanal", data.diasEntrenamiento],
    ["Experiencia previa", data.practicoPilates],
    ["Condición Física (1-10)", data.condicionFisica]
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [['2 y 3. Objetivos y Actividad', '']],
    body: goalsActivity,
    theme: 'grid',
    headStyles: { fillColor: [124, 144, 130] },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
  });
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 4. Dolor y Limitaciones
  const painData = [
    ["¿Presenta dolor?", data.tieneDolor],
    ["Zonas afectadas", data.zonasDolor.join(', ') || 'Ninguna'],
    ["Intensidad (1-10)", data.intensidadDolor],
    ["Factores que agravan", data.queEmpeora || 'N/A'],
    ["Factores que alivian", data.queMejora || 'N/A'],
    ["Movimientos evitados", data.movimientosEvita || 'N/A']
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [['4. Dolor y Molestias', '']],
    body: painData,
    theme: 'striped',
    headStyles: { fillColor: [124, 144, 130] },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
  });
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Nueva página si es necesario
  if (currentY > 220) { doc.addPage(); currentY = 20; }

  // 5, 6 y 7. Salud e Historial
  const medicalData = [
    ["Lesiones previas", data.lesionesImportantes === 'Sí' ? data.cualesLesiones : 'No'],
    ["Cirugías", data.cirugias === 'Sí' ? data.cualesCirugias : 'No'],
    ["Condiciones de salud", data.condicionesSalud.join(', ') || 'Ninguna'],
    ["Medicación regular", data.tomaMedicacion === 'Sí' ? data.cualMedicacion : 'No'],
    ["Señales de alerta (Red Flags)", data.redFlags.length > 0 ? data.redFlags.join(', ') : 'Ninguna']
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [['5, 6 y 7. Historial Médico', '']],
    body: medicalData,
    theme: 'grid',
    headStyles: { fillColor: data.redFlags.length > 0 ? [180, 80, 80] : [124, 144, 130] },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
  });
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 8, 9 y 10. Estilo de vida
  const lifestyleData = [
    ["Horas sentado al día", data.horasSentado],
    ["Nivel de estrés", data.nivelEstres],
    ["Percepción corporal", data.rigidoFlexible],
    ["Calidad del sueño", data.duermeBien === 'Sí' ? `Bien (${data.horasSueno}h)` : 'No'],
    ["Expectativas (1-3 meses)", data.expectativa1Mes],
    ["Obstáculos detectados", data.impedimentoConstancia.join(', ')]
  ];

  (doc as any).autoTable({
    startY: currentY,
    head: [['8, 9 y 10. Estilo de Vida y Expectativas', '']],
    body: lifestyleData,
    theme: 'striped',
    headStyles: { fillColor: [124, 144, 130] },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Este documento contiene información confidencial del alumno para Angi Pilates Studio.", pageWidth / 2, 285, { align: "center" });

  doc.save(`Evaluacion_${data.nombre.replace(/\s+/g, '_')}.pdf`);
};
