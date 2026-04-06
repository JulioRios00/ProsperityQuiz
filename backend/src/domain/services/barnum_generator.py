"""Barnum effect text generator for personalized diagnoses (in Portuguese)."""
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

# Blocked area diagnosis texts
BLOCKED_AREA_DIAGNOSIS: Dict[str, Dict[str, str]] = {
    "financeiro": {
        "label": "Financeiro",
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
    "relacionamentos": {
        "label": "Relacionamentos",
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
    "saude": {
        "label": "Saúde e Vitalidade",
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
    "tudo": {
        "label": "Múltiplas Dimensões",
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
    "proposito": {
        "label": "Propósito e Missão",
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

    # Main blocked area diagnosis
    area = BLOCKED_AREA_DIAGNOSIS.get(blocked_area, BLOCKED_AREA_DIAGNOSIS["financeiro"])
    parts.append(area["main"])
    parts.append(area["detail"])

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
