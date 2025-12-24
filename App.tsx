
import React, { useState, useEffect } from 'react';
import { EvaluationData, DiagnosisResponse } from './types';
import { generateAIDiagnosis } from './services/geminiService';
import { downloadPDF } from './utils/pdfGenerator';
import FormSection from './components/FormSection';
import InputField from './components/InputField';
import CheckboxGroup from './components/CheckboxGroup';
import RadioGroup from './components/RadioGroup';

const MOTIVATIONAL_PHRASES = [
  "La paciencia y la persistencia son cualidades vitales en el logro de cualquier esfuerzo que valga la pena.",
  "En 10 sesiones sentirás la diferencia, en 20 verás la diferencia, y en 30 te habrá cambiado el cuerpo.",
  "La buena postura se puede adquirir con éxito solo cuando todo el mecanismo del cuerpo está bajo un control perfecto.",
  "El movimiento fluye desde un centro fuerte.",
  "Tu camino hacia una versión más fuerte y flexible ha comenzado hoy."
];

// Número de teléfono de Angi
const INSTRUCTOR_PHONE = "59173608068"; 

const initialFormState: EvaluationData = {
  nombre: '', edad: '', sexo: '', telefono: '', ocupacion: '',
  objetivos: [], otroObjetivo: '',
  realizaActividad: '', cualActividad: '', diasEntrenamiento: '',
  practicoPilates: '', haceCuantoPilates: '', experienciaPilates: '', condicionFisica: 5,
  tieneDolor: '', zonasDolor: [], otraZonaDolor: '', intensidadDolor: 0, duracionDolor: '',
  queEmpeora: '', queMejora: '', movimientosEvita: '',
  lesionesImportantes: '', cualesLesiones: '', cirugias: '', cualesCirugias: '',
  prohibicionEjercicio: '', explicacionProhibicion: '',
  condicionesSalud: [], semanasEmbarazo: '', otraCondicionSalud: '',
  tomaMedicacion: '', cualMedicacion: '',
  redFlags: [],
  horasSentado: '', duermeBien: '', horasSueno: '', nivelEstres: '', zonaTensa: '',
  rigidoFlexible: '', cansaEstarDePie: '', posturaBuena: '',
  expectativa1Mes: '', expectativa3Meses: '',
  impedimentoConstancia: [], otroImpedimento: ''
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<EvaluationData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    setMotivation(MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]);
  }, [showSuccess]);

  const updateField = (field: keyof EvaluationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Calculamos el diagnóstico para el resumen de WhatsApp
      const result = await generateAIDiagnosis(formData);
      setDiagnosis(result);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error generating diagnosis:", error);
      alert("Hubo un error al procesar tu evaluación. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!diagnosis) return;

    // Generamos el PDF SIN el diagnóstico de la IA
    downloadPDF(formData);

    const aptitudEmoji = diagnosis.aptitud === 'APTO' ? '🟢' : diagnosis.aptitud === 'APTO_AJUSTES' ? '🟡' : '🔴';
    
    const message = `*NUEVA EVALUACIÓN COMPLETADA*%0A%0A` +
      `*Alumno:* ${formData.nombre}%0A` +
      `*Aptitud (IA):* ${aptitudEmoji} ${diagnosis.aptitud}%0A%0A` +
      `_Hola Angi, he descargado mi ficha de evaluación. Te la adjunto a continuación._`;

    window.open(`https://wa.me/${INSTRUCTOR_PHONE}?text=${message}`, '_blank');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-soft-sage flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-emerald-100 animate-bounce-slow">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-sage-dark mb-4">¡Evaluación Enviada!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Gracias por completar tu evaluación inicial. Tu instructor revisará los resultados en breve.
          </p>
          
          <div className="bg-emerald-50 p-6 rounded-2xl mb-8 italic text-emerald-800 border border-emerald-100 text-sm">
            "{motivation}"
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Al pulsar el botón se generará tu reporte PDF. Por favor, <strong>adjúntalo</strong> en el chat de WhatsApp que se abrirá.
          </p>

          <div className="space-y-4">
            <button 
              onClick={handleWhatsAppShare}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar a Angi por WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-sage p-4 md:p-8">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-sage-dark mb-4">Angi Pilates Studio</h1>
        <div className="h-1 w-24 bg-emerald-200 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 italic">"Movimiento consciente para un bienestar integral"</p>
        <h2 className="mt-8 text-2xl font-semibold text-gray-700 uppercase tracking-wide">Evaluación Inicial</h2>
      </header>

      <main className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title="1. DATOS PERSONALES">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nombre completo" value={formData.nombre} onChange={v => updateField('nombre', v)} required />
              <InputField label="Edad" value={formData.edad} onChange={v => updateField('edad', v)} type="number" />
              <RadioGroup label="Sexo" options={['Femenino', 'Masculino', 'Otro', 'Prefiero no decir']} value={formData.sexo} onChange={v => updateField('sexo', v)} />
              <InputField label="Teléfono / WhatsApp" value={formData.telefono} onChange={v => updateField('telefono', v)} />
              <InputField label="Ocupación / actividad laboral" value={formData.ocupacion} onChange={v => updateField('ocupacion', v)} />
            </div>
          </FormSection>

          <FormSection title="2. OBJETIVO PRINCIPAL">
            <CheckboxGroup 
              label="¿Qué esperás lograr con Pilates Reformer? (marcar hasta 2)"
              options={[
                'Reducir dolores', 'Mejorar postura', 'Fortalecer core',
                'Aumentar flexibilidad', 'Rehabilitación', 'Reducir estrés', 
                'Rendimiento deportivo', 'Tonificación'
              ]}
              values={formData.objetivos}
              onChange={v => updateField('objetivos', v)}
            />
            <InputField label="Otro objetivo:" value={formData.otroObjetivo} onChange={v => updateField('otroObjetivo', v)} className="mt-2" />
          </FormSection>

          <FormSection title="3. EXPERIENCIA Y ACTIVIDAD FÍSICA">
            <RadioGroup label="¿Realizás actividad física actualmente?" options={['No', 'Sí']} value={formData.realizaActividad} onChange={v => updateField('realizaActividad', v)} />
            {formData.realizaActividad === 'Sí' && <InputField label="¿Cuál?" value={formData.cualActividad} onChange={v => updateField('cualActividad', v)} />}
            <RadioGroup label="Días por semana que entrenás:" options={['0', '1–2', '3–4', '5 o más']} value={formData.diasEntrenamiento} onChange={v => updateField('diasEntrenamiento', v)} />
            <RadioGroup label="¿Has practicado Pilates antes?" options={['Nunca', 'Pilates Mat', 'Pilates Reformer', 'Ambos']} value={formData.practicoPilates} onChange={v => updateField('practicoPilates', v)} />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Escala de condición física actual (1 al 10)</label>
              <input type="range" min="1" max="10" value={formData.condicionFisica} onChange={e => updateField('condicionFisica', parseInt(e.target.value))} className="w-full accent-sage" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 (Baja)</span><span>{formData.condicionFisica}</span><span>10 (Excelente)</span></div>
            </div>
          </FormSection>

          <FormSection title="4. DOLOR Y MOLESTIAS">
            <RadioGroup label="¿Tenés dolor actualmente?" options={['No', 'Sí']} value={formData.tieneDolor} onChange={v => updateField('tieneDolor', v)} />
            {formData.tieneDolor === 'Sí' && (
              <div className="space-y-4 mt-4">
                <CheckboxGroup label="Zonas de dolor:" options={['Cuello', 'Espalda alta', 'Lumbar', 'Cadera', 'Rodilla', 'Tobillo', 'Hombro']} values={formData.zonasDolor} onChange={v => updateField('zonasDolor', v)} />
                <InputField label="Intensidad (1-10):" value={formData.intensidadDolor.toString()} onChange={v => updateField('intensidadDolor', parseInt(v) || 0)} type="number" />
                <InputField label="¿Qué empeora el dolor?" value={formData.queEmpeora} onChange={v => updateField('queEmpeora', v)} />
                <InputField label="¿Qué lo mejora?" value={formData.queMejora} onChange={v => updateField('queMejora', v)} />
              </div>
            )}
          </FormSection>

          <FormSection title="5. HISTORIAL MÉDICO">
            <RadioGroup label="¿Tuviste lesiones importantes?" options={['No', 'Sí']} value={formData.lesionesImportantes} onChange={v => updateField('lesionesImportantes', v)} />
            {formData.lesionesImportantes === 'Sí' && <InputField label="¿Cuáles?" value={formData.cualesLesiones} onChange={v => updateField('cualesLesiones', v)} />}
            <RadioGroup label="¿Te realizaron cirugías?" options={['No', 'Sí']} value={formData.cirugias} onChange={v => updateField('cirugias', v)} />
            {formData.cirugias === 'Sí' && <InputField label="¿Cuál y cuándo?" value={formData.cualesCirugias} onChange={v => updateField('cualesCirugias', v)} />}
          </FormSection>

          <FormSection title="6. CONDICIONES DE SALUD">
            <CheckboxGroup 
              label="Marcar si aplica:"
              options={['Hipertensión', 'Problemas cardíacos', 'Diabetes', 'Hernia discal', 'Ciática', 'Embarazo']}
              values={formData.condicionesSalud}
              onChange={v => updateField('condicionesSalud', v)}
            />
            <RadioGroup label="¿Tomás medicación?" options={['No', 'Sí']} value={formData.tomaMedicacion} onChange={v => updateField('tomaMedicacion', v)} className="mt-4" />
            {formData.tomaMedicacion === 'Sí' && <InputField label="¿Cuál?" value={formData.cualMedicacion} onChange={v => updateField('cualMedicacion', v)} />}
          </FormSection>

          <FormSection title="7. SEÑALES DE ALERTA" className="border-l-4 border-red-200">
            <CheckboxGroup 
              label="¿Presentás alguno de estos síntomas?"
              options={[
                'Adormecimiento u hormigueo', 'Pérdida de fuerza',
                'Mareos o falta de aire', 'Cirugía reciente (< 6 meses)'
              ]}
              values={formData.redFlags}
              onChange={v => updateField('redFlags', v)}
            />
          </FormSection>

          <FormSection title="8. HÁBITOS Y ESTILO DE VIDA">
            <RadioGroup label="Horas sentado/a al día:" options={['<4', '4–6', '6–8', '+8']} value={formData.horasSentado} onChange={v => updateField('horasSentado', v)} />
            <RadioGroup label="Nivel de estrés diario:" options={['Bajo', 'Medio', 'Alto']} value={formData.nivelEstres} onChange={v => updateField('nivelEstres', v)} />
            <InputField label="Zona de mayor tensión corporal:" value={formData.zonaTensa} onChange={v => updateField('zonaTensa', v)} />
          </FormSection>

          <FormSection title="9. PERCEPCIÓN CORPORAL">
            <RadioGroup label="¿Te sentís rígido/a o flexible?" options={['Muy rígido/a', 'Normal', 'Flexible']} value={formData.rigidoFlexible} onChange={v => updateField('rigidoFlexible', v)} />
            <RadioGroup label="¿Sentís que tu postura es buena?" options={['Sí', 'No', 'No estoy seguro/a']} value={formData.posturaBuena} onChange={v => updateField('posturaBuena', v)} />
          </FormSection>

          <FormSection title="10. EXPECTATIVAS">
            <InputField label="¿Qué resultado te gustaría ver en 1-3 meses?" value={formData.expectativa1Mes} onChange={v => updateField('expectativa1Mes', v)} />
            <CheckboxGroup label="¿Qué suele impedirte ser constante?" options={['Tiempo', 'Dolor', 'Desmotivación']} values={formData.impedimentoConstancia} onChange={v => updateField('impedimentoConstancia', v)} />
          </FormSection>

          <div className="pt-10 pb-20 flex justify-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? 'Procesando...' : 'Finalizar y Enviar Evaluación'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default App;
