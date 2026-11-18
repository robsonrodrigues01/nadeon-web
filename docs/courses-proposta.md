# Proposta pendente para páginas de curso

As páginas usam os títulos, descrições e resumos de lição presentes nos boards e no `contentProvider`. Os exemplos de instrutor, credenciais, licença, biografia, fotos, amostra de e-mail, corpo das lições, perguntas frequentes e promessas de entrega não são publicados como fatos; os dados pendentes aparecem como “To be confirmed”.

Antes do lançamento, confirmar nomes e credenciais dos instrutores, conteúdo integral e revisão clínica/veterinária das lições, respostas de FAQ, política e sequência de entrega do curso, lista correspondente no Mailyte e a mensagem de confirmação após inscrição. Hoje a ação usa `FormsProvider.subscribe` com os identificadores provisórios `course-30-day-longevity` e `course-senior-dog-care`, e envia somente e-mail. Nome e nome do cão são validados, mas não persistidos nem encaminhados porque o contrato atual não possui campos para esses dados.
