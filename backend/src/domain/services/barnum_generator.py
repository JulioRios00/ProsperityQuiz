"""Barnum effect text generator for personalized diagnoses (in Portuguese)."""
import random
from typing import Dict, List

# Age range introductions — personalized by life phase
AGE_RANGE_INTRO: Dict[str, str] = {
    "25-34": (
        "Na fase dos 25 aos 34 anos, você está em plena construção da sua identidade e potência. "
        "Mulheres nessa faixa frequentemente sentem que já deveriam ter chegado mais longe, "
        "mas um bloqueio invisível tem sabotado silenciosamente cada tentativa de avanço."
    ),
    "35-44": (
        "Entre os 35 e 44 anos, você está no auge da sua inteligência emocional e criativa. "
        "É a fase em que os padrões se tornam mais visíveis — e também mais fáceis de transformar, "
        "se você souber onde olhar."
    ),
    "45-54": (
        "Dos 45 aos 54 anos, você carrega uma sabedoria acumulada que poucas possuem. "
        "Sua capacidade de transformação está no pico — e o bloqueio que identificamos "
        "é exatamente o que separa você da vida que sempre mereceu."
    ),
    "55+": (
        "Com mais de 55 anos, você possui uma maestria de vida incomparável. "
        "Sua maturidade espiritual e emocional chegou ao ponto certo para destravar "
        "o que ficou represado por anos. Os próximos dias serão decisivos."
    ),
}

# Blocked area diagnosis — 6 variants per area, one is picked randomly
BLOCKED_AREA_DIAGNOSIS: Dict[str, Dict] = {
    "financeiro": {
        "label": "Financeiro",
        "variants": [
            {
                "main": (
                    "Seu bloqueio principal está na dimensão financeira. "
                    "Identificamos uma crença limitante instalada ainda na infância que diz, em essência, "
                    "que abundância material não é algo seguro — ou merecido — para você."
                ),
                "detail": (
                    "Isso se manifesta como um ciclo repetitivo: sempre que você se aproxima de um novo "
                    "patamar financeiro, uma força invisível puxa você de volta ao ponto anterior. "
                    "Não é falta de esforço nem de capacidade. É um padrão vibracional que opera "
                    "abaixo da sua consciência."
                ),
            },
            {
                "main": (
                    "Identificamos em seu perfil energético uma programação de escassez que opera "
                    "como um teto invisível. Cada vez que sua renda começa a crescer, esse mecanismo "
                    "inconsciente ativa um freio — gastando de forma impulsiva, sabotando oportunidades "
                    "ou atraindo despesas inesperadas."
                ),
                "detail": (
                    "Essa programação não vem da sua geração. Ela foi herdada — absorvida em silêncio "
                    "durante a infância ao observar como os adultos ao seu redor se relacionavam com o "
                    "dinheiro. Padrões herdados são os mais rápidos de desfazer quando se sabe o que procurar."
                ),
            },
            {
                "main": (
                    "Seu campo energético carrega uma frequência de conflito com dinheiro — uma tensão "
                    "profunda entre querer prosperar e acreditar inconscientemente que prosperidade "
                    "tem um custo alto demais: amor, segurança ou identidade."
                ),
                "detail": (
                    "Por isso você trabalha muito, entrega muito, e mesmo assim a recompensa financeira "
                    "nunca chega na proporção do seu esforço. Não é azar. Não é falta de talento. "
                    "É uma equação vibracional que está errada — e que pode ser recalibrada."
                ),
            },
            {
                "main": (
                    "Detectamos um padrão de autossabotagem financeira silenciosa. Ele não aparece "
                    "em decisões grandes e óbvias — aparece nas pequenas: no preço que você cobra, "
                    "na proposta que você não manda, na oportunidade que você deixa passar "
                    "achando que 'não é o momento certo'."
                ),
                "detail": (
                    "Esse padrão cria uma ilusão de movimento: você está sempre ocupada, sempre se "
                    "esforçando, mas a posição financeira quase não muda. Como uma esteira — muito "
                    "esforço, nenhum deslocamento real. O bloqueio está na base, não na superfície."
                ),
            },
            {
                "main": (
                    "Seu diagnóstico aponta uma crença central que diz: 'ganhar muito dinheiro muda "
                    "as pessoas' — ou que dinheiro é fonte de conflito, ciúme e afastamento. "
                    "Essa crença funciona como um mecanismo de proteção emocional disfarçado de humildade."
                ),
                "detail": (
                    "O resultado prático: você inconscientemente trava seu próprio crescimento financeiro "
                    "para preservar seus relacionamentos e sua identidade. Mas o que parece proteção "
                    "é, na verdade, a maior limitação que existe na sua vida hoje."
                ),
            },
            {
                "main": (
                    "Identificamos uma ruptura energética no seu eixo de recepção — a parte de você "
                    "que deveria receber, aceitar e reter abundância financeira está bloqueada. "
                    "Você sabe dar. Sabe trabalhar. Mas há uma resistência profunda em receber o "
                    "que é seu por direito."
                ),
                "detail": (
                    "Isso aparece de formas concretas: dificuldade em aceitar ajuda, em cobrar o valor "
                    "real do seu trabalho, em guardar dinheiro sem sentir culpa. Não é falta de "
                    "disciplina. É um sistema energético que aprendeu que receber é perigoso."
                ),
            },
        ],
    },
    "relacionamentos": {
        "label": "Relacionamentos",
        "variants": [
            {
                "main": (
                    "Seu bloqueio principal está na dimensão dos relacionamentos. "
                    "Existe um padrão profundo de autoproteção que se disfarça de independência, "
                    "mas que na verdade impede conexões genuínas e duradouras."
                ),
                "detail": (
                    "Você tende a sabotar vínculos exatamente quando eles começam a aprofundar. "
                    "Pode ser através de distanciamento emocional, exigências impossíveis ou simples "
                    "fuga. Isso não define quem você é — é uma programação que pode ser reescrita."
                ),
            },
            {
                "main": (
                    "Seu bloqueio nos relacionamentos está diretamente conectado à sua relação com "
                    "prosperidade. Existe uma crença enraizada de que amor e abundância financeira "
                    "não coexistem — que para ser amada, você precisa se diminuir, inclusive financeiramente."
                ),
                "detail": (
                    "Isso cria um ciclo devastador: você se mantém abaixo do seu potencial financeiro "
                    "para não ameaçar vínculos, ou escolhe relacionamentos com pessoas que inconscientemente "
                    "confirmam sua limitação. A transformação financeira começa quando esse padrão é reconhecido."
                ),
            },
            {
                "main": (
                    "Identificamos um padrão de dependência emocional invertida: você supre as "
                    "necessidades dos outros antes das suas, inclusive financeiramente, e isso drena "
                    "não só sua energia mas seu potencial de acúmulo."
                ),
                "detail": (
                    "Você empresta quando não deveria, arca com despesas que não são suas, coloca "
                    "os planos dos outros acima dos seus projetos. Isso não é generosidade — é um "
                    "padrão de autoanulação que tem custo financeiro real e mensurável na sua vida."
                ),
            },
            {
                "main": (
                    "Seu campo vibracional carrega uma ferida de abandono que se manifesta tanto nos "
                    "relacionamentos quanto no dinheiro. O medo de ser deixada ativa comportamentos "
                    "de urgência — e urgência é inimiga da prosperidade."
                ),
                "detail": (
                    "Decisões financeiras tomadas com urgência emocional quase sempre custam caro: "
                    "compras impulsivas, investimentos mal avaliados, aceitação de condições "
                    "desfavoráveis por medo de perder. O bloqueio não é financeiro na origem — "
                    "é emocional, e precisa ser tratado assim."
                ),
            },
            {
                "main": (
                    "Detectamos que seu sistema de crenças associa dinheiro a conflito nos "
                    "relacionamentos. Crescer financeiramente, para você, ativa inconscientemente "
                    "o medo de provocar inveja, afastamento ou mudanças nos vínculos que você mais valoriza."
                ),
                "detail": (
                    "Por isso, sempre que você se aproxima de um salto financeiro real, algo interno "
                    "freia. Não é falta de capacidade — é um sistema de proteção emocional mal calibrado, "
                    "que confunde crescimento com perda. Quando essa equação muda, tudo muda junto."
                ),
            },
            {
                "main": (
                    "Seu diagnóstico revela que a forma como você se relaciona com as pessoas espelha "
                    "exatamente a forma como você se relaciona com o dinheiro: com desconfiança, "
                    "com distância segura, nunca completamente entregue."
                ),
                "detail": (
                    "Você se aproxima mas não se permite depender. No dinheiro, isso significa nunca "
                    "se sentir segura financeiramente, mesmo quando as condições melhoram. Ambos os "
                    "padrões têm a mesma raiz — e a mesma solução."
                ),
            },
        ],
    },
    "saude": {
        "label": "Saúde e Vitalidade",
        "variants": [
            {
                "main": (
                    "Seu bloqueio principal está na dimensão da saúde e vitalidade. "
                    "Existe uma desconexão significativa entre o que sua mente comanda "
                    "e o que seu corpo consegue entregar."
                ),
                "detail": (
                    "Fadiga inexplicável, tensão crônica, resistência a cuidar de si mesma — "
                    "esses são sintomas de um sistema energético pedindo realinhamento urgente. "
                    "Seu corpo não está trabalhando contra você. Está tentando se comunicar."
                ),
            },
            {
                "main": (
                    "O corpo guarda o que a mente não consegue processar. Seu estado de saúde e "
                    "vitalidade está diretamente ligado à tensão acumulada de carregar um bloqueio "
                    "financeiro por tempo demais — o peso invisível de não conseguir avançar drena "
                    "sua energia física antes mesmo de qualquer esforço."
                ),
                "detail": (
                    "Cansaço sem causa aparente, imunidade baixa, dificuldade de foco — não são "
                    "coincidências. São o corpo pedindo que o sistema energético seja reorganizado. "
                    "Quando o fluxo de prosperidade é desbloqueado, a energia física acompanha "
                    "de forma quase imediata."
                ),
            },
            {
                "main": (
                    "Seu diagnóstico revela um padrão de autoabandono que se manifesta tanto na "
                    "saúde quanto nas finanças. Você cuida de tudo e de todos antes de cuidar "
                    "de si mesma — e isso tem custo duplo: físico e financeiro."
                ),
                "detail": (
                    "Adiar consultas, não investir em saúde preventiva, não reservar tempo para si — "
                    "esses comportamentos refletem uma crença de que você não merece prioridade. "
                    "Essa mesma crença opera nas suas finanças: adiando investimentos, não cobrando "
                    "o que vale, não priorizando seu crescimento."
                ),
            },
            {
                "main": (
                    "Existe uma conexão direta entre seu nível de vitalidade e sua capacidade de "
                    "atrair e reter prosperidade. Quando o corpo opera em modo de sobrevivência, "
                    "a mente não consegue operar em modo de expansão — e expansão financeira "
                    "exige exatamente isso."
                ),
                "detail": (
                    "Seu sistema energético está operando abaixo da frequência necessária para "
                    "atrair oportunidades. Não por fraqueza — por excesso. Você carrega muito: "
                    "responsabilidades, preocupações, expectativas dos outros. Redistribuir essa "
                    "carga é o primeiro passo para a virada financeira."
                ),
            },
            {
                "main": (
                    "Seu campo energético mostra uma desconexão entre esforço e resultado que se "
                    "repete tanto na saúde quanto nas finanças. Você se esforça muito, mas a "
                    "sensação é de estar sempre no mesmo lugar — física e financeiramente."
                ),
                "detail": (
                    "Isso acontece porque o esforço está sendo aplicado no lugar errado. Trabalhar "
                    "mais no nível da ação sem tratar o nível do padrão é como remar contra a maré "
                    "— muito desgaste, pouco avanço. O desbloqueio acontece quando você começa a "
                    "agir nos momentos certos, com a frequência certa."
                ),
            },
            {
                "main": (
                    "Detectamos no seu perfil um ciclo de altos e baixos de energia que sabota tanto "
                    "sua produtividade quanto suas finanças. Dias de muita disposição seguidos de "
                    "quedas bruscas — esse ritmo irregular é a assinatura energética de um bloqueio não tratado."
                ),
                "detail": (
                    "Nos dias baixos, você não consegue aproveitar oportunidades. Nos dias altos, "
                    "você queima energia em excesso tentando compensar. O calendário de abundância "
                    "existe exatamente para acabar com esse ciclo: agir nos dias de alta vibracional "
                    "e preservar energia nos dias de bloqueio ativo."
                ),
            },
        ],
    },
    "tudo": {
        "label": "Múltiplas Dimensões",
        "variants": [
            {
                "main": (
                    "Seu diagnóstico revela algo importante: o bloqueio não está concentrado em uma única área. "
                    "Ele permeia múltiplas dimensões da sua vida — finanças, relacionamentos, saúde e propósito — "
                    "como se uma raiz central estivesse alimentando todas as manifestações ao mesmo tempo."
                ),
                "detail": (
                    "Isso não significa que sua situação é mais grave. Significa que o padrão vibracional "
                    "instalado é mais antigo e mais central. Quando tratado na origem, o desbloqueio "
                    "acontece de forma simultânea em todas as áreas — e a transformação é proporcionalmente maior."
                ),
            },
            {
                "main": (
                    "Quando todas as áreas parecem travadas ao mesmo tempo, isso é uma informação "
                    "importante: o bloqueio não está na superfície. Ele está na fundação — na forma "
                    "como você foi programada, ainda criança, para se relacionar com merecimento, "
                    "com visibilidade e com prosperidade."
                ),
                "detail": (
                    "Mudar uma área de cada vez, nesse caso, não funciona. É como trocar telhas com "
                    "a fundação comprometida. O desbloqueio precisa acontecer na raiz — e quando "
                    "acontece, todas as áreas se movem juntas, de forma simultânea e sustentável."
                ),
            },
            {
                "main": (
                    "Seu diagnóstico confirma o que você provavelmente já sente: nada parece fluir. "
                    "Não é falta de esforço — é excesso de bloqueio em camadas. Cada área da sua "
                    "vida que está travada é uma camada de um mesmo padrão central que nunca foi "
                    "diretamente endereçado."
                ),
                "detail": (
                    "Financeiramente, isso significa renda instável ou abaixo do potencial. "
                    "Energeticamente, significa esgotamento constante. Relacionalmente, significa "
                    "vínculos que drenam em vez de nutrir. Mas a origem é uma só — e uma solução "
                    "na origem desfaz todas as camadas ao mesmo tempo."
                ),
            },
            {
                "main": (
                    "Quando o diagnóstico aponta bloqueio em múltiplas dimensões, estamos diante "
                    "de um padrão geracional — não criado por você, mas herdado e carregado por você. "
                    "Prosperidade, saúde, amor, propósito: todos reprimidos pelo mesmo programa "
                    "inconsciente de escassez."
                ),
                "detail": (
                    "A boa notícia é que padrões geracionais têm uma característica única: quando "
                    "quebrados, quebram para sempre — e os efeitos se propagam para frente, mudando "
                    "não só a sua vida mas a das pessoas ao seu redor. Você tem a oportunidade de "
                    "ser o ponto de virada da sua linhagem."
                ),
            },
            {
                "main": (
                    "O bloqueio multidimensional que identificamos no seu perfil tem uma característica "
                    "específica: ele se fortalece com o tempo. Cada ano que passa sem tratamento na "
                    "raiz, os padrões se tornam mais rígidos e mais difíceis de reverter."
                ),
                "detail": (
                    "Mas há uma janela — e você está nela agora. O momento em que você reconhece "
                    "o padrão é o momento em que ele perde parte do poder. A consciência é o primeiro "
                    "instrumento de transformação. O que vem depois é alinhamento, timing e ação "
                    "no momento certo."
                ),
            },
            {
                "main": (
                    "Seu campo energético mostra saturação: muitas responsabilidades, muitas "
                    "expectativas, pouca reciprocidade. Quando tudo parece travado, o sistema "
                    "energético está em colapso de recepção — você dá, entrega e carrega, "
                    "mas não consegue receber na mesma proporção."
                ),
                "detail": (
                    "Isso se manifesta como bloqueio financeiro (dinheiro que sai mais do que entra), "
                    "relacional (cansaço nos vínculos), físico (falta de energia) e de propósito "
                    "(sensação de estar vivendo a vida dos outros, não a sua). Reequilibrar o eixo "
                    "de recepção é o que muda tudo — e é exatamente para onde o trabalho aponta."
                ),
            },
        ],
    },
    "proposito": {
        "label": "Propósito e Missão",
        "variants": [
            {
                "main": (
                    "Seu bloqueio principal está na dimensão do propósito. "
                    "Você sente claramente que veio para algo maior, mas uma força paralisante "
                    "aparece exatamente no momento de agir."
                ),
                "detail": (
                    "O medo de visibilidade e a síndrome do impostor se disfarçam de humildade ou "
                    "de 'não estar pronta ainda'. O resultado é uma vida vivida abaixo do impacto "
                    "que você poderia — e deveria — causar no mundo."
                ),
            },
            {
                "main": (
                    "Você tem clareza do seu propósito — o que falta é a estrutura vibracional para "
                    "materializá-lo financeiramente. Existe uma crença que separa 'fazer o que ama' "
                    "de 'ganhar bem fazendo isso', como se as duas coisas fossem incompatíveis por natureza."
                ),
                "detail": (
                    "Essa crença faz você subestimar o valor do que entrega, aceitar condições abaixo "
                    "do que merece, ou adiar a profissionalização do seu propósito indefinidamente. "
                    "A missão não muda. O que precisa mudar é a relação entre missão e prosperidade."
                ),
            },
            {
                "main": (
                    "Seu diagnóstico aponta para uma paralisia de visibilidade: você sabe o que quer "
                    "fazer, tem o talento necessário, mas algo trava exatamente na hora de se "
                    "posicionar, de aparecer, de cobrar pelo que entrega."
                ),
                "detail": (
                    "Esse bloqueio de visibilidade tem custo financeiro direto e imediato. Cada vez "
                    "que você se encolhe, uma oportunidade passa. Cada vez que você cobra menos do "
                    "que deveria, você reforça a crença de que seu trabalho vale menos. O ciclo se "
                    "repete até que a raiz seja tratada."
                ),
            },
            {
                "main": (
                    "Existe em você uma tensão não resolvida entre o que você foi ensinada a ser e "
                    "o que você realmente sente que veio fazer. Essa tensão consome uma energia "
                    "enorme — energia que deveria estar sendo canalizada para construir prosperidade real."
                ),
                "detail": (
                    "Você oscila entre seguir o caminho seguro e ouvir o chamado interno. Essa "
                    "oscilação se traduz em instabilidade financeira: momentos de avanço seguidos "
                    "de recuos, projetos começados e não concluídos, receita inconsistente. Quando "
                    "o propósito se alinha com a prosperidade, a instabilidade desaparece."
                ),
            },
            {
                "main": (
                    "Seu perfil revela um padrão de desvalorização do próprio trabalho que está "
                    "diretamente ligado a quanto você permite receber. Você entrega alto nível, "
                    "mas cobra nível básico — e essa diferença representa tudo que você está "
                    "deixando de ganhar todos os meses."
                ),
                "detail": (
                    "Isso não é humildade. É um programa de autolimitação que aprendeu que pedir "
                    "o que você vale é perigoso — pode gerar rejeição, perda de clientes, "
                    "desaprovação. Mas o preço de não pedir é muito mais alto do que o preço "
                    "de ser rejeitada eventualmente."
                ),
            },
            {
                "main": (
                    "Detectamos que você está operando em modo de preparação permanente: sempre "
                    "estudando mais, se capacitando mais, esperando o momento certo para agir. "
                    "Esse padrão disfarça o verdadeiro bloqueio — o medo de tentar e descobrir "
                    "que não é suficiente."
                ),
                "detail": (
                    "O resultado financeiro é devastador: você investe em formação mas não converte "
                    "em renda. Você sabe muito mas entrega pouco no mercado. Não porque não está "
                    "pronta — mas porque o sistema de crenças ainda não atualizou essa informação. "
                    "É exatamente isso que o diagnóstico tridimensional veio revelar."
                ),
            },
        ],
    },
}

# Symptom/sign labels used in step_8
SIGNS_MAP: Dict[str, str] = {
    "money_gone":    "dinheiro que entra e some sem explicação",
    "projects":      "projetos que nunca decolam de verdade",
    "restart":       "sensação de estar sempre recomeçando do zero",
    "self_sabotage": "autossabotagem em momentos-chave",
    "charge_fear":   "medo de cobrar o que realmente vale",
    "not_for_me":    "sensação de que prosperidade 'não é pra mim'",
}

# Blockage level context — intensity of the energetic block
BLOCKAGE_LEVEL_SUFFIX: Dict[int, str] = {
    1: (
        "O bloqueio ainda está em fase inicial. Isso significa que você ainda tem energia "
        "suficiente para reverter o padrão com menos esforço do que imagina."
    ),
    2: (
        "O bloqueio está presente mas ainda não enraizado. A janela de transformação "
        "está aberta — e agir agora faz toda a diferença."
    ),
    3: (
        "O bloqueio está moderadamente instalado. Você provavelmente já tentou mudar "
        "esse padrão antes, sem sucesso duradouro. A razão é que a raiz nunca foi tratada."
    ),
    4: (
        "O bloqueio está profundamente instalado. Ele afeta múltiplas áreas da sua vida, "
        "mesmo que você só perceba em uma delas. O trabalho precisa ser feito na origem."
    ),
    5: (
        "O bloqueio está em nível crítico. Ele já definiu decisões importantes da sua vida "
        "e continuará fazendo isso, a menos que seja tratado na raiz — e com urgência."
    ),
}

URGENCY_CLOSING = (
    "Com base em tudo que analisamos hoje, identificamos que você está em uma janela "
    "vibracional rara — um período onde o potencial de transformação está amplificado. "
    "Essa janela não fica aberta indefinidamente. Nos próximos {days} dias, o alinhamento "
    "entre sua numerologia pessoal e o campo coletivo cria uma abertura que raramente se repete."
)


def build_diagnosis_text(
    age_range: str,
    blocked_area: str,
    signs: List[str],
    blockage_level: int,
    favorable_days: int,
) -> str:
    """Assemble personalized diagnosis text using Barnum effect templates."""
    parts = []

    # Phase intro based on age
    intro = AGE_RANGE_INTRO.get(age_range, AGE_RANGE_INTRO["35-44"])
    parts.append(intro)

    # Main blocked area diagnosis — pick one variant at random
    area = BLOCKED_AREA_DIAGNOSIS.get(blocked_area, BLOCKED_AREA_DIAGNOSIS["financeiro"])
    variant = random.choice(area["variants"])
    parts.append(variant["main"])
    parts.append(variant["detail"])

    # Signs manifestation paragraph
    sign_texts = [SIGNS_MAP[s] for s in signs if s in SIGNS_MAP]
    if sign_texts:
        if len(sign_texts) == 1:
            formatted = sign_texts[0]
        else:
            formatted = ", ".join(sign_texts[:-1]) + f" e {sign_texts[-1]}"
        parts.append(
            f"Os sinais que você identificou — {formatted} — são manifestações diretas "
            "desse padrão vibracional atuando no seu campo energético."
        )

    # Blockage level intensity context
    level_text = BLOCKAGE_LEVEL_SUFFIX.get(blockage_level, BLOCKAGE_LEVEL_SUFFIX[3])
    parts.append(level_text)

    # Urgency closing with favorable days
    parts.append(URGENCY_CLOSING.format(days=favorable_days))

    return "\n\n".join(parts)
