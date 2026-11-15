export const healthData = {
 metrics: [
 {id:'pressure',name:'Presión arterial',value:'118/76',unit:'mmHg',system:'cardio',source:'Tensiómetro · Simulado',note:'Consulta la lectura junto con su fecha y condiciones de medición.'},
 {id:'heart',name:'Frecuencia cardíaca',value:'72',unit:'lpm',system:'cardio',source:'Sensor de pulso · Simulado',note:'El historial permite explorar cambios respecto a mediciones anteriores.'},
 {id:'glucose',name:'Glucosa',value:'92',unit:'mg/dL',system:'nutrition',source:'Glucómetro · Simulado',note:'Registra el momento de la medición y su relación con las comidas.'},
 {id:'temperature',name:'Temperatura corporal',value:'36.6',unit:'°C',system:'immune',source:'Termómetro · Simulado',note:'Revisa el método de medición antes de comparar resultados.'},
 {id:'sleep',name:'Descanso diario',value:'7.5',unit:'h',system:'mood',source:'Registro de sueño · Simulado',note:'Horario registrado de 23:00 a 06:30. Puedes actualizarlo al despertar.'},
 {id:'mood',name:'Estado de ánimo',value:'Bien',unit:'',system:'mood',source:'Autoregistro · Demostración',note:'Tu registro personal complementa las actividades de bienestar.'}
 ],
 systems: {
 immune:{name:'Salud inmunitaria',symbol:'✧',heading:'Seguimiento inmunitario',description:'Reúne resultados y observaciones de las evaluaciones de la tripulación.',actions:['Sangre · Sin resultados importados','Orina · Sin resultados importados','Heces · Sin resultados importados'],button:'Registrar seguimiento'},
 bone:{name:'Salud ósea',symbol:'╫',heading:'Movimiento y salud ósea',description:'Consulta tu rutina y registra las actividades realizadas. La densidad ósea requiere una evaluación específica.',actions:['Rutina de ejercicio · Plan de ejemplo','Evaluación ósea · Sin resultados','Próxima actividad · 16:00'],button:'Registrar ejercicio'},
 cardio:{name:'Cardiovascular',symbol:'♡',heading:'Salud cardiovascular',description:'Revisa lecturas, síntomas registrados y estudios disponibles.',actions:['Ecocardiograma · Sin estudio cargado','Ultrasonido · Sin estudio cargado','Procedimiento clínico · Pendiente de validación'],button:'Registrar observación'},
 nutrition:{name:'Nutrición',symbol:'◒',heading:'Nutrición e hidratación',description:'Organiza tus comidas y los recordatorios de tu plan nutricional.',actions:['Próxima comida · 14:00','Plan de suplementos · Sin prescripción cargada','Registro de hidratación · Disponible'],button:'Registrar hidratación'},
 mood:{name:'Bienestar emocional',symbol:'☼',heading:'Un momento para ti',description:'Registra cómo te sientes y accede a tus actividades de bienestar.',actions:['Ánimo · Autoregistro voluntario','Descanso · Horario y duración','Conexión emocional · Biblioteca local'],button:'Registrar ánimo'}
 }
};
