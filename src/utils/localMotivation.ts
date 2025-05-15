// Banco de dados local de dicas motivacionais para uso quando a API estiver indisponível

// Lista de dicas motivacionais pré-definidas
export const motivationalTips = [
  // Conjunto 1
  `1. Pequenas mudanças diárias levam a grandes resultados ao longo do tempo. Comece hoje!

2. Celebre cada vitória, por menor que seja - cada escolha saudável é um passo na direção certa.

3. Seu corpo está mudando mesmo quando a balança não mostra - músculos pesam mais que gordura.

4. Foque em como você se sente, não apenas nos números - mais energia e disposição são sinais de progresso.

5. Transformar hábitos leva tempo - seja paciente e persista mesmo nos dias difíceis.`,

  // Conjunto 2
  `1. A jornada de emagrecimento não é uma linha reta - aceite os altos e baixos como parte do processo.

2. Visualize seu objetivo e lembre-se do porquê começou quando sentir vontade de desistir.

3. Nunca subestime o poder de uma boa noite de sono para seu metabolismo e controle da fome.

4. Cada vez que você resiste a uma tentação, seu cérebro forma novos padrões saudáveis.

5. Não busque a perfeição, busque a consistência - 80% de aderência constante supera 100% por uma semana.`,

  // Conjunto 3
  `1. Seu corpo foi feito para se mover - encontre atividades que você realmente goste de fazer.

2. A hidratação adequada aumenta seu metabolismo em até 30% - beba água frequentemente.

3. Planeje as refeições com antecedência para evitar escolhas impulsivas quando estiver com fome.

4. Seu diálogo interno importa - substitua "eu tenho que fazer dieta" por "eu escolho alimentar meu corpo com qualidade".

5. Você já superou desafios antes - use essa força para superar os obstáculos na sua jornada de emagrecimento.`,

  // Conjunto 4
  `1. Seu corpo é único - compare seu progresso apenas com você mesmo, nunca com os outros.

2. Transformar seu corpo também transforma sua mente - observe como sua confiança cresce com cada objetivo alcançado.

3. Quando a motivação falha, a disciplina sustenta - crie rotinas que funcionem mesmo nos dias mais difíceis.

4. Identifique seus gatilhos emocionais para comer e desenvolva estratégias saudáveis para lidar com eles.

5. Cerque-se de pessoas que apoiam seus objetivos - o ambiente social tem enorme impacto no sucesso.`,

  // Conjunto 5
  `1. Respirar profundamente por 2 minutos acalma a mente e reduz a vontade de comer por impulso.

2. Pergunte-se: "Isso me aproxima ou me afasta dos meus objetivos?" antes de cada escolha alimentar.

3. Veja os deslizes como oportunidades de aprendizado, não como falhas - o que você pode fazer diferente na próxima vez?

4. Seu corpo é uma máquina incrível que se adapta constantemente - agradeça por tudo que ele faz por você.

5. Foque nos hábitos, não nos resultados - os resultados virão como consequência natural dos bons hábitos.`,

  // Conjunto 6
  `1. Não existe uma única forma de alcançar resultados - encontre a abordagem que funciona para sua vida e seu corpo.

2. Desafie-se a aprender uma nova receita saudável por semana - a variedade mantém a alimentação interessante.

3. Pequenas vitórias se acumulam - celebre cada semana consistente, cada escolha consciente.

4. Lembre-se que o estresse constante eleva o cortisol, dificultando a perda de peso - pratique técnicas de relaxamento.

5. Ser saudável é um estilo de vida, não uma fase temporária - concentre-se em mudanças que você possa manter para sempre.`,

  // Conjunto 7
  `1. Seu peso não define seu valor - cuide da sua saúde porque você merece se sentir bem.

2. Experimente novos sabores e texturas de alimentos saudáveis para evitar o tédio alimentar.

3. Monitore seu progresso de formas além da balança - como roupas mais confortáveis ou mais energia.

4. Quando sentir fome, pergunte-se se está realmente com fome ou apenas entediado, estressado ou cansado.

5. Você não precisa ser perfeito para progredir - o importante é seguir em frente após cada obstáculo.`,

  // Conjunto 8
  `1. Defina metas menores e mais frequentes para manter o impulso e a motivação elevados.

2. Evite a mentalidade de "tudo ou nada" - um único alimento menos saudável não estraga todo o seu progresso.

3. Sua mente acredita no que você repete - pratique afirmações positivas sobre sua capacidade de alcançar seus objetivos.

4. Lembre-se que exercícios constroem músculos que queimam calorias mesmo quando você está em repouso.

5. É normal sentir vontade de desistir - nos momentos difíceis, visualize como você se sentirá ao alcançar suas metas.`,

  // Conjunto 9
  `1. Mantenha-se focado nos benefícios que vão além da estética - como melhor saúde, disposição e qualidade de vida.

2. O progresso nem sempre é linear - plateaus são normais e temporários, mantenha a consistência.

3. Alimente-se com consciência - saboreie cada garfada, sem distrações como celular ou televisão.

4. Tenha um plano para ocasiões especiais - permita-se desfrutar com moderação, sem culpa ou abandono total.

5. Cuide da sua saúde mental tanto quanto da física - o bem-estar emocional é fundamental para resultados duradouros.`,

  // Conjunto 10
  `1. Deixe de lado o "eu vou tentar" e adote o "eu vou fazer" - sua linguagem molda suas ações.

2. Lembre-se que um futuro mais saudável vale cada esforço que você faz hoje.

3. Aceite que haverá dias melhores e piores - a chave é voltar ao caminho certo rapidamente após desvios.

4. Uma noite de sono adequado reduz a fome e melhora suas escolhas alimentares no dia seguinte.

5. Valorize cada passo da jornada - o processo de transformação é tão importante quanto o resultado final.`
];

// Função para obter um conjunto aleatório de dicas baseado no ID do usuário
export function getRandomMotivationalTips(userId: string, weeksOnDiet: number = 1): string {
  // Usar uma combinação do ID do usuário e semana na dieta para ter pseudo-aleatoriedade
  const seed = userId + weeksOnDiet.toString();
  
  // Criar um valor hash simples
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; // Converter para inteiro de 32 bits
  }
  
  // Garantir que seja positivo e dentro do range do array
  const positiveHash = Math.abs(hash);
  const index = positiveHash % motivationalTips.length;
  
  return motivationalTips[index];
} 