
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationData, DiagnosisResponse } from "../types";

export const generateAIDiagnosis = async (data: EvaluationData): Promise<DiagnosisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    Analiza el siguiente perfil de alumno para Pilates Reformer y genera un informe profesional:

    DATOS DEL ALUMNO:
    - Nombre: ${data.nombre}, Edad: ${data.edad}, Sexo: ${data.sexo}
    - Objetivos: ${data.objetivos.join(', ')} ${data.otroObjetivo}
    - Actividad física: ${data.realizaActividad} (${data.cualActividad})
    - Dolor actual: ${data.tieneDolor}, Zonas: ${data.zonasDolor.join(', ')}, Intensidad: ${data.intensidadDolor}/10
    - Historial: Lesiones (${data.lesionesImportantes}), Cirugías (${data.cirugias})
    - Condiciones: ${data.condicionesSalud.join(', ')}
    - Alertas: ${data.redFlags.join(', ')}
    - Estilo de vida: Estrés ${data.nivelEstres}, Tensión en ${data.zonaTensa}
    - Percepción corporal: ${data.rigidoFlexible}, Postura ${data.posturaBuena}
    - Expectativas: ${data.expectativa1Mes}

    REGLAS DE APTITUD:
    1. Si hay alertas críticas (sección 7), aptitud: 'MEDICO'.
    2. Si hay dolor intenso (>7) o condiciones como Hernia/Embarazo, aptitud: 'APTO_AJUSTES'.
    3. Si el perfil es saludable, aptitud: 'APTO'.

    Genera JSON con:
    - analisis (resumen del estado)
    - recomendaciones (tips técnicos de Pilates)
    - puntosAtencion (riesgos detectados)
    - aptitud (APTO, APTO_AJUSTES, MEDICO)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analisis: { type: Type.STRING },
            recomendaciones: { type: Type.ARRAY, items: { type: Type.STRING } },
            puntosAtencion: { type: Type.ARRAY, items: { type: Type.STRING } },
            aptitud: { 
              type: Type.STRING,
              enum: ['APTO', 'APTO_AJUSTES', 'MEDICO']
            }
          },
          required: ["analisis", "recomendaciones", "puntosAtencion", "aptitud"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
