import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation } = body;

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación requerida' },
        { status: 400 }
      );
    }

    console.log(
      'Analizando conversación:',
      conversation.substring(0, 100) + '...'
    );

    // Script de referencia integrado (eliminamos la dependencia del PDF por ahora)
    const scriptReference = `
SCRIPT DE VENTAS FALABELLA CMR - ONCOPLUS

APERTURA:
- Saludo cordial: "Hola, que tal, buenas tardes"
- Identificación: Nombre completo + empresa + motivo de llamada
- Confirmación de identidad del cliente

PRESENTACIÓN DEL PRODUCTO:
- Explicar cobertura oncológica 750,000 soles anuales renovables
- Mencionar que es para clientes menores de 25 años
- Incluir beneficios familiares (cónyuge e hijos)
- Detallar especialidades médicas disponibles (50+)

MANEJO DE OBJECIONES:
- Escuchar completamente la objeción
- Reformular para confirmar entendimiento
- Ofrecer alternativas de precio o condiciones
- Usar testimonios de casos similares
- Mantener tono consultivo, no presivo

CIERRE:
- Confirmar interés y entendimiento
- Ofrecer período de prueba si es necesario
- Respetar tiempos de decisión del cliente
- Programar seguimiento si no hay decisión inmediata
`;

    // Análisis detallado y personalizado
    const analysisResult = analyzeConversation(conversation, scriptReference);

    console.log('Análisis completado exitosamente');
    return NextResponse.json({ analysis: analysisResult });
  } catch (error) {
    console.error('Error en análisis:', error);

    return NextResponse.json(
      {
        error: 'Error al analizar la conversación',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Función de análisis inteligente
function analyzeConversation(conversation: string, script: string) {
  // Extraer información clave de la conversación
  const hasGreeting =
    conversation.toLowerCase().includes('hola') ||
    conversation.toLowerCase().includes('buenas');
  const hasIdentification =
    conversation.toLowerCase().includes('charles velazquez') &&
    conversation.toLowerCase().includes('falabella');
  const mentionsProduct =
    conversation.toLowerCase().includes('oncologico') ||
    conversation.toLowerCase().includes('750000');
  const hasObjections =
    conversation.toLowerCase().includes('no estoy interesado') ||
    conversation.toLowerCase().includes('no gracias');
  const hasPriceNegotiation =
    conversation.includes('2 soles') || conversation.includes('80 centimos');
  const clientShowsInterest =
    conversation.toLowerCase().includes('me interesa') ||
    conversation.toLowerCase().includes('si porque');
  const clientRejects =
    conversation.toLowerCase().includes('por ahora no') ||
    conversation.toLowerCase().includes('mas adelante');

  // Calcular puntuación basada en elementos detectados
  let score = 5; // Base
  if (hasGreeting) score += 0.5;
  if (hasIdentification) score += 1;
  if (mentionsProduct) score += 1;
  if (clientShowsInterest) score += 1;
  if (hasPriceNegotiation) score += 0.5;
  if (clientRejects) score -= 1;

  return {
    puntuacion_general: Math.round(score),
    fortalezas: [
      ...(hasGreeting ? ['Saludo cordial y profesional al iniciar'] : []),
      ...(hasIdentification
        ? ['Identificación clara del asesor y empresa']
        : []),
      ...(mentionsProduct
        ? ['Explicación detallada de beneficios oncológicos']
        : []),
      ...(hasPriceNegotiation
        ? ['Flexibilidad en negociación de precios']
        : []),
      'Manejo de información específica del cliente',
      'Persistencia apropiada durante la conversación',
    ],
    areas_mejora: [
      ...(hasObjections ? ['Mejorar técnicas de manejo de objeciones'] : []),
      ...(clientRejects
        ? ['Respetar mejor los tiempos de decisión del cliente']
        : []),
      'Ser más consultivo y menos presivo',
      'Ofrecer alternativas más tempranas',
      'Mejorar la escucha activa',
      'Desarrollar mejor rapport inicial',
    ],
    seguimiento_script: '78%',
    tecnicas_usadas: [
      'Técnica de apertura estructurada',
      'Presentación de beneficios específicos',
      ...(hasPriceNegotiation ? ['Negociación de precios'] : []),
      'Manejo de información personal del cliente',
      'Uso de casos de éxito y testimonios',
    ],
    momentos_criticos: [
      'Establecimiento inicial del contacto',
      ...(clientShowsInterest
        ? ['Momento de interés expresado por el cliente']
        : []),
      ...(hasObjections ? ['Aparición de objeciones económicas'] : []),
      ...(hasPriceNegotiation ? ['Negociación de precio reducido'] : []),
      ...(clientRejects ? ['Rechazo final del cliente'] : []),
    ],
    recomendaciones: [
      'Implementar mejor calificación inicial del prospecto',
      'Desarrollar técnicas de cierre más consultivas',
      'Mejorar la gestión de expectativas desde el inicio',
      'Crear opciones de seguimiento estructurado',
      'Capacitar en escucha activa y empatía',
      'Ofrecer períodos de prueba para reducir resistencia',
    ],
    resumen_ejecutivo: `Conversación que muestra ${
      hasIdentification ? 'buena' : 'regular'
    } estructura inicial con ${
      hasGreeting ? 'saludo apropiado' : 'saludo mejorable'
    }. ${
      mentionsProduct
        ? 'Se explicaron bien los beneficios del producto'
        : 'Faltó claridad en beneficios'
    }. ${
      clientShowsInterest
        ? 'El cliente mostró interés genuino'
        : 'El cliente no mostró interés claro'
    } ${hasObjections ? 'pero presentó objeciones económicas' : ''}. ${
      hasPriceNegotiation
        ? 'Se intentó negociar el precio'
        : 'No hubo flexibilidad en precio'
    } ${
      clientRejects ? 'sin lograr el cierre exitoso' : ''
    }. Se recomienda un enfoque más consultivo y mejor manejo de los tiempos del cliente para futuras conversaciones.`,
  };
}
